import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { InitialFormValues } from '../../../interfaces';
import { getUrlParam, removeNonDigits } from '../../../utils/misc';
import Layout from '../../../components/Layout';
import RegistrationForm from '../../../components/RegistrationForm';
import useEventQuery from '../../../hooks/useEventQuery';

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

export default function Register() {
  const router = useRouter();
  const query = useEventQuery(
    getUrlParam(router.query.tag) as 'fall' | 'winter' | undefined
  );

  return (
    <Layout
      title={query.isLoading ? 'Loading...' : query.data ? query.data.name : ''}
    >
      <RegisterStyles>
        {query.data ? (
          <div className="page-container">
            <div className="header">
              <img
                src={`../../${query.data.tag}-logo.png`}
                alt={`${query.data.name} logo`}
                className="logo"
              />
              <h2>
                <span>Registration</span> {query.data.name}
              </h2>
              <p className="dates">
                {format(new Date(query.data.dates[0]), 'EEEE M/d, yyyy')} -{' '}
                {format(
                  new Date(query.data.dates[query.data.dates.length - 1]),
                  'EEEE M/d, yyyy'
                )}
              </p>
            </div>
            <div className="form">
              <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={values => {
                  console.log(values);
                }}
              >
                {props => <RegistrationForm {...props} event={query.data} />}
              </Formik>
            </div>
          </div>
        ) : null}
      </RegisterStyles>
    </Layout>
  );
}

const RegisterStyles = styled.div`
  padding: 3rem 1.5rem;

  .page-container {
    margin: 0 auto;
    max-width: 32rem;
    width: 100%;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo {
    width: 6rem;
  }

  h2 {
    margin: 1rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;

    span {
      margin: 0 0 0.625rem;
      display: block;
      font-size: 1.125rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .dates {
    margin: 1.125rem auto 0;
    display: inline-flex;
    padding: 0.375rem 0.875rem;
    background-color: #1f2937;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #f3f4f6;
    line-height: initial;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .form {
    margin: 3rem 0 0;
  }

  @media (max-width: 375px) {
    .dates {
      font-size: 0.6875rem;
    }
  }
`;
