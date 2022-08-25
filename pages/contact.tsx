import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import BasicLayout from '../components/layouts/BasicLayout';
import { removeNonDigits } from '../utils/misc';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .transform(value => {
      return removeNonDigits(value);
    })
    .matches(new RegExp(/^\d{10}$/), 'Must be a valid 10 digit number'),
  message: Yup.string().required('A message is required'),
});

export default function Contact() {
  const [status, setStatus] = React.useState<'idle' | 'error' | 'success'>(
    'idle'
  );

  return (
    <BasicLayout title="Contact us">
      <ContactStyles>
        <div className="page-container">
          {status !== 'success' ? (
            <>
              <div className="logos">
                <Link href="/event/fall">
                  <a>
                    <img
                      src="/fall-logo.png"
                      alt="Doty's Dusty Dryland Event"
                    />
                  </a>
                </Link>
                <Link href="/event/winter">
                  <a>
                    <img
                      src="/winter-logo.png"
                      alt="Doty's Dog Days of Winter"
                    />
                  </a>
                </Link>
              </div>
              <h3>Contact 3D Mushing Events</h3>
              <p>
                Please let us know if you have questions about our events, your
                registration, etc. We look forward to hearing from you.
              </p>
              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  phone: '',
                  message: '',
                  hp: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, actions) => {
                  if (values.hp !== '') return;

                  const response = await fetch('/api/send-contact-message', {
                    method: 'POST',
                    body: JSON.stringify(values),
                    headers: { 'Content-Type': 'application/json' },
                  });

                  if (!response.ok) {
                    setStatus('error');
                    actions.setSubmitting(false);
                    return;
                  }

                  setStatus('success');
                }}
              >
                {props => (
                  <Form>
                    <div className="item">
                      <label htmlFor="name">Name</label>
                      <Field name="name" id="name" />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="validation-error"
                      />
                    </div>
                    <div className="grid-cols-2">
                      <div className="item">
                        <label htmlFor="email">Email address</label>
                        <Field name="email" id="email" />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="validation-error"
                        />
                      </div>
                      <div className="item">
                        <label htmlFor="phone">Phone number</label>
                        <Field name="phone" id="phone" />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="validation-error"
                        />
                      </div>
                    </div>
                    <div className="item">
                      <label htmlFor="message">Your message</label>
                      <Field as="textarea" name="message" id="message" />
                      <ErrorMessage
                        name="message"
                        component="div"
                        className="validation-error"
                      />
                    </div>
                    <div className="item sr-only">
                      <label htmlFor="hp">Leave this field blank</label>
                      <Field name="hp" id="hp" tabIndex={-1} />
                    </div>
                    <div className="actions">
                      <button
                        type="submit"
                        disabled={props.isSubmitting}
                        className="submit-button"
                      >
                        {props.isSubmitting ? (
                          <LoadingSpinner />
                        ) : (
                          'Send your message'
                        )}
                      </button>
                    </div>
                    {status === 'error' ? (
                      <div className="server-error">
                        Internal server error. Please try sending again.
                      </div>
                    ) : null}
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            <div className="success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h3>We got your message!</h3>
              <p>
                Thanks for reaching out. We will be with you as soon as we can.
              </p>
              <div className="success-actions">
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="reset-button"
                >
                  Reset the form
                </button>
                <Link href="/">
                  <a className="home-link">Back to homepage</a>
                </Link>
              </div>
            </div>
          )}
        </div>
      </ContactStyles>
    </BasicLayout>
  );
}

const ContactStyles = styled.div`
  padding: 3rem 1.5rem 5rem;

  .page-container {
    margin: 0 auto;
    max-width: 34rem;
    width: 100%;
  }

  .logos {
    display: flex;
    justify-content: center;
    gap: 1.25rem;

    img {
      width: 5rem;
    }

    a {
      transition: transform 100ms linear;

      &:hover {
        transform: translateY(-3px);
      }
    }
  }

  h2 {
    margin: 1rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    color: #111827;
  }

  h3 {
    margin: 1.125rem 0 0;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #111827;
    text-align: center;
  }

  p {
    margin: 1rem 0 0;
    font-size: 1rem;
    font-weight: 500;
    color: #6b7280;
    line-height: 1.5;
    text-align: center;
  }

  form {
    margin: 2.25rem 0 0;
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
  }

  .validation-error,
  .server-error {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #be123c;
    line-height: 1.5;
  }

  .server-error {
    margin: 1rem 0 0;
    text-align: center;
  }

  .success {
    margin: 1.5rem 0 0;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

    svg {
      height: 3rem;
      width: 3rem;
      color: #047857;
    }

    h3 {
      margin: 0.75rem 0 0;
      font-size: 1.25rem;
    }

    p {
      margin: 1rem auto 0;
      max-width: 24rem;
    }

    .success-actions {
      margin: 1.5rem 0 0;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
      gap: 1rem;
    }

    .reset-button,
    .home-link {
      padding: 0.75rem 1.75rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border: none;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.3125rem;
      cursor: pointer;
      transition: all 100ms linear;

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      &:focus-visible {
        box-shadow: #f9fafb 0px 0px 0px 2px, #2672e5 0px 0px 0px 4px,
          rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      }
    }

    .reset-button {
      background-color: #fff;
      color: #1f2937;
      border: 1px solid #d1d5db;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

      &:hover {
        border-color: #bbc1ca;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.1);
      }
    }

    .home-link {
      background-color: #263244;
      color: #f3f4f6;

      &:hover {
        background-color: #2d3b51;
      }
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
