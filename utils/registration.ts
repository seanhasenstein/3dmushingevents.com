import React from 'react';
import { NextRouter } from 'next/router';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import { CardElementComponent } from '@stripe/react-stripe-js';
import * as Yup from 'yup';
import { InitialFormValues } from '../interfaces';
import { getUrlParam, removeNonDigits } from './misc';
import { createRegistrationFetch } from '../queries';

export const initialValues: InitialFormValues = {
  firstName: '',
  lastName: '',
  gender: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  age: '',
  guardian: '',
  races: [],
  cardholder: '',
};

export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .transform(value => {
      return removeNonDigits(value);
    })
    .matches(new RegExp(/^\d{10}$/), 'Must be a valid 10 digit number')
    .required('Phone is required'),
  city: Yup.string().required('Your city is required'),
  state: Yup.string().required('Your state is required'),
  age: Yup.string()
    .test('age-test', 'Invalid age provided', (values, context) => {
      if (isNaN(Number(values))) {
        return context.createError({ message: 'Invalid age provided' });
      }

      return true;
    })
    .required('Age on race day is required'),
  guardian: Yup.string().when('age', {
    is: (value: string) => Number(value) < 18,
    then: schema => schema.required('Guardian is requied for anyone under 18'),
  }),
  races: Yup.array().min(1, 'At least 1 race is required'),
  cardholder: Yup.string().required('Cardholder name is required'),
});

interface SubmitParams {
  formValues: InitialFormValues;
  stripe: Stripe | null;
  elements: StripeElements | null | undefined;
  CardElement: CardElementComponent;
  router: NextRouter;
  setServerError: React.Dispatch<React.SetStateAction<string | undefined>>;
  setStripeError: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const handleSubmit = async ({
  formValues,
  stripe,
  elements,
  CardElement,
  router,
  setServerError,
  setStripeError,
}: SubmitParams) => {
  try {
    const tagUrlParam = getUrlParam(router.query.tag);
    const cardElement = elements?.getElement(CardElement);

    if (!stripe || !cardElement) {
      throw new Error(
        'Error loading Stripe. Please refresh the page and try again'
      );
    }

    if (!tagUrlParam || (tagUrlParam !== 'fall' && tagUrlParam !== 'winter')) {
      throw new Error('url tag parameter must be `fall` or `winter`');
    }

    const stripePaymentMethod = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: formValues.cardholder,
        email: formValues.email.toLowerCase().trim(),
        phone: removeNonDigits(formValues.phone),
      },
    });

    if (stripePaymentMethod.error) {
      throw new Error(stripePaymentMethod.error.message);
    }

    const createRegistration = await createRegistrationFetch(
      formValues,
      tagUrlParam,
      stripePaymentMethod.paymentMethod.id
    );

    router.push(
      `/event/${getUrlParam(router.query.tag)}/confirmation?id=${
        createRegistration.registrationId
      }`
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      if (err.message === 'Internal server error.') {
        setServerError(err.message);
      } else {
        setStripeError(err.message);
      }
    }
  }
};
