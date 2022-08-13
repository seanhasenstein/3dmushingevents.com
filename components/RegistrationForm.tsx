import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Event, InitialFormValues } from '../interfaces';
import { unitedStates } from '../utils/states';
import { formatToMoney, getUrlParam, removeNonDigits } from '../utils/misc';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import FormSummary from './FormSummary';
import FormErrorsOnSubmitScroll from './FormErrorsOnSubmitScroll';
import { createRegistrationFetch } from '../queries';
import Link from 'next/link';

const initialValues: InitialFormValues = {
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

const validationSchema = Yup.object().shape({
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

interface Props {
  event: Event | undefined;
}

export default function RegistrationForm(props: Props) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const errorsRef = React.useRef<HTMLDivElement>(null);
  const [stripeError, setStripeError] = React.useState<string>();
  const [serverError, setServerError] = React.useState<string>();

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    if (e.error) {
      setStripeError(e.error.message);
      return;
    }
    setStripeError(undefined);
  };

  const handleSubmit = async (formValues: InitialFormValues) => {
    try {
      const tagUrlParam = getUrlParam(router.query.tag);
      const cardElement = elements?.getElement(CardElement);

      if (!stripe || !cardElement) {
        throw new Error(
          'Error loading Stripe. Please refresh the page and try again'
        );
      }

      if (
        !tagUrlParam ||
        (tagUrlParam !== 'fall' && tagUrlParam !== 'winter')
      ) {
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

  return (
    <RegistrationFormStyles>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={values => handleSubmit(values)}
      >
        {({ values, isSubmitting, isValid, submitCount, errors }) => (
          <Form>
            <div className="race-selection">
              <h3>
                <span>Select your races</span>
              </h3>
              <div className="item">
                <label htmlFor="race" className="sr-only">
                  Select a race
                </label>
                <FieldArray
                  name="races"
                  render={arrayHelpers => (
                    <div>
                      {values.races.length < 1 ? (
                        <div className="item">
                          <Field as="select" name="races.0" id="races.0">
                            <option value="">Select a race</option>
                            {props.event?.races.map(r => (
                              <option key={`0.${r.id}`} value={r.id}>
                                {r.sled} - {r.category}
                                {r.breed ? ` - ${r.breed}` : null} -{' '}
                                {formatToMoney(r.price)}
                              </option>
                            ))}
                          </Field>
                        </div>
                      ) : (
                        <>
                          {values.races.map((_race, index) => (
                            <div key={index} className="race-item">
                              <Field
                                as="select"
                                name={`races.${index}`}
                                id={`races.${index}`}
                              >
                                <option value="">Select a race</option>
                                {props.event?.races.map(r => (
                                  <option key={r.id} value={r.id}>
                                    {r.sled} - {r.category}
                                    {r.breed ? ` - ${r.breed}` : null} -{' '}
                                    {formatToMoney(r.price)}
                                  </option>
                                ))}
                              </Field>
                              <div className="remove-race-row">
                                <button
                                  type="button"
                                  onClick={() => arrayHelpers.remove(index)}
                                  className="remove-race-button"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="sr-only">
                                    Remove this race
                                  </span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      {values.races.length > 0 &&
                      values.races[values.races.length - 1] !== '' ? (
                        <div className="add-race-row">
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.insert(values.races.length, '')
                            }
                            className="add-race-button"
                          >
                            Add another race
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                />
                <ErrorMessage
                  component="div"
                  name="races"
                  className="validation-error"
                />
              </div>
            </div>
            <div className="participant-information section">
              <h3>
                <span>Participant information</span>
              </h3>
              <div className="grid-cols-2">
                <div className="item">
                  <label htmlFor="firstName">First name</label>
                  <Field name="firstName" id="firstName" />
                  <ErrorMessage
                    component="div"
                    name="firstName"
                    className="validation-error"
                  />
                </div>
                <div className="item">
                  <label htmlFor="lastName">Last name</label>
                  <Field name="lastName" id="lastName" />
                  <ErrorMessage
                    component="div"
                    name="lastName"
                    className="validation-error"
                  />
                </div>
              </div>
              <div className="item">
                <label htmlFor="email">Email</label>
                <Field name="email" id="email" />
                <ErrorMessage
                  component="div"
                  name="email"
                  className="validation-error"
                />
              </div>
              <div className="item">
                <label htmlFor="phone">Phone</label>
                <Field name="phone" id="phone" />
                <ErrorMessage
                  component="div"
                  name="phone"
                  className="validation-error"
                />
              </div>
              <div className="grid-cols-2">
                <div className="item">
                  <label htmlFor="city">City</label>
                  <Field name="city" id="city" />
                  <ErrorMessage
                    component="div"
                    name="city"
                    className="validation-error"
                  />
                </div>
                <div className="item">
                  <label htmlFor="state">State</label>
                  <Field as="select" name="state" id="state">
                    <option value="">Select your state</option>
                    {unitedStates.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.text}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    component="div"
                    className="validation-error"
                    name="state"
                  />
                </div>
              </div>
              <div className="item">
                <label htmlFor="gender">Gender</label>
                <Field as="select" name="gender" id="gender">
                  <option value="">Select your gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </Field>
                <ErrorMessage
                  component="div"
                  className="validation-error"
                  name="state"
                />
              </div>
              <div className="item">
                <label htmlFor="age">Age on race day</label>
                <Field name="age" id="age" />
                <ErrorMessage
                  component="div"
                  name="age"
                  className="validation-error"
                />
              </div>
              <div className="item">
                <label htmlFor="guardian">
                  Guardian (required if under 18)
                </label>
                <Field name="guardian" id="guardian" />
                <ErrorMessage
                  component="div"
                  name="guardian"
                  className="validation-error"
                />
              </div>
            </div>
            <div className="section">
              <h3>
                <span>Review your registration</span>
              </h3>
              <div className="review-registration">
                {values.races.length > 0 ? (
                  <div className="selected-races">
                    <h4>Selected races</h4>
                    <div>
                      {values.races.map(r => {
                        const race = props.event?.races.find(er => er.id === r);

                        if (race) {
                          return (
                            <div key={r} className="selected-race">
                              <p className="race-name">
                                {race.sled} - {race.category}
                                {race.breed ? ` - ${race.breed}` : ''}
                              </p>
                              <p className="race-price">
                                {formatToMoney(race.price)}
                              </p>
                            </div>
                          );
                        }
                      })}
                    </div>
                    <FormSummary values={values} event={props.event} />
                  </div>
                ) : (
                  <div className="no-races-selected">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <h4>No races selected</h4>
                    <p>You need to select at least 1 race to register.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="payment-section section">
              <h3>
                <span>Payment information</span>
              </h3>
              <div className="item">
                <label htmlFor="cardholder">Cardholder name</label>
                <Field name="cardholder" id="cardholder" />
                <ErrorMessage
                  component="div"
                  name="cardholder"
                  className="validation-error"
                />
              </div>
              <div className="item">
                <label htmlFor="stripe">Card details</label>
                <CardElement id="payment-element" onChange={handleCardChange} />
                {stripeError ? (
                  <div className="stripe-error">{stripeError}</div>
                ) : null}
              </div>
            </div>
            <div className="actions">
              <button
                type="submit"
                disabled={
                  !stripe ||
                  !elements ||
                  values.races.length === 0 ||
                  isSubmitting
                }
                className="submit-button"
              >
                {isSubmitting ? (
                  <LoadingSpinner />
                ) : values.races.length === 0 ? (
                  'Please select at least 1 race'
                ) : (
                  'Submit your registration'
                )}
              </button>
            </div>
            <FormErrorsOnSubmitScroll
              errors={errors}
              errorsRef={errorsRef}
              isValid={isValid}
              submitCount={submitCount}
            />
            {serverError && !stripeError ? (
              <div className="server-error">
                {serverError}
                Try submitting your registration again. If the problem continues
                please{' '}
                <Link href="/contact">
                  <a>contact us</a>
                </Link>
                .
              </div>
            ) : null}
          </Form>
        )}
      </Formik>
    </RegistrationFormStyles>
  );
}

const RegistrationFormStyles = styled.div`
  h3 {
    position: relative;
    font-size: 1.125rem;
    font-weight: 600;
    text-align: center;
    z-index: 10;

    span {
      padding: 0 1.25rem;
      background-color: #f9fafb;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0.75rem;
      left: 0;
      height: 1px;
      width: 100%;
      background-color: #d1d5db;
      z-index: -1;
    }
  }

  .race-item {
    margin: 1.125rem 0 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 2.5rem;
    width: 100%;

    &:first-of-type {
      margin: 0;
    }
  }

  .remove-race-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .remove-race-button {
    padding: 0.25rem 0.25rem;
    background-color: transparent;
    border: none;
    color: #6b7280;
    cursor: pointer;
    transition: color 100ms linear;

    &:hover {
      color: #111827;
    }

    svg {
      height: 1.125rem;
      width: 1.125rem;
    }
  }

  .add-race-row {
    margin: 1rem 0 0;
    padding: 0 2.5rem 0 0;
    display: flex;
    justify-content: flex-end;
  }

  .add-race-button {
    padding: 0.5rem 1rem;
    background-color: #263244;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: #f3f4f6;
    border-radius: 0.3125rem;
    cursor: pointer;
    transition: all 100ms linear;

    &:hover {
      background-color: #2d3b51;
    }
    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }
    &:focus-visible {
      box-shadow: #f9fafb 0px 0px 0px 2px, #2672e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .section {
    margin: 3rem 0 0;

    h3 {
      margin: 0 0 0.75rem;
    }
  }

  .grid-cols-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    gap: 0 1.5rem;
  }

  .item {
    margin: 1.25rem 0 0;
    display: flex;
    flex-direction: column;
  }

  .review-registration {
    margin: 1.625rem 0 0;
    padding: 1.125rem 1.25rem;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .selected-races {
    h4 {
      font-size: 1rem;
      font-weight: 600;
    }
  }

  .selected-race {
    padding: 0.375rem 0;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;

    &:first-of-type {
      margin: 0.5rem 0 0;
    }
  }

  .no-races-selected {
    margin: 0 0 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    h4 {
      margin: 0.4375rem 0 0;
      font-size: 1rem;
      font-weight: 600;
      text-align: center;
    }

    p {
      margin: 0.3125rem 0 0;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #6b7280;
      text-align: center;
    }

    svg {
      height: 1.5rem;
      width: 1.5rem;
      color: #9ca3af;
    }
  }

  .actions {
    margin: 1.75rem 0 0;
    display: flex;
    justify-content: flex-end;
  }

  .submit-button {
    position: relative;
    padding: 0 1.75rem;
    height: 2.5rem;
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #263244;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: #f3f4f6;
    border-radius: 0.3125rem;
    cursor: pointer;
    transition: all 100ms linear;

    &:hover {
      background-color: #2d3b51;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: #f9fafb 0px 0px 0px 2px, #2672e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    &:disabled,
    &:disabled:hover {
      background-color: #263244;
      color: rgba(255, 255, 255, 0.75);
      cursor: default;
    }
  }

  .validation-error {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #be123c;
    line-height: 1.5;
  }

  /* STRIPE CARD ELEMENT STYLES */
  .StripeElement {
    margin: 0;
    padding: 0.625rem 0.75rem;
    background-color: #fff;
    border: 1px solid #c9cbd1;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .StripeElement--focus {
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px, #1860cc 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    border: 1px solid #1860cc;
  }

  .stripe-error,
  .server-error {
    margin: 1rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #be123c;
    line-height: 1.5;

    a {
      text-decoration: underline;
    }

    svg {
      height: 0.875rem;
      width: 0.875rem;
    }
  }

  @media (max-width: 640px) {
    .add-race-button {
      width: 100%;
    }

    .submit-button {
      max-width: unset;
    }
  }
`;

const LoadingSpinner = styled.span`
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border-top: 2px solid #9499a4;
    border-right: 2px solid transparent;
    animation: spinner 0.6s linear infinite;
  }
`;
