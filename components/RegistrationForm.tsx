import React from 'react';
import styled from 'styled-components';
import { Form, Field, FieldArray, FormikProps, ErrorMessage } from 'formik';
import { Event, InitialFormValues } from '../interfaces';
import { unitedStates } from '../utils/states';
import {
  calculateRegistrationSummary,
  formatToMoney,
  includeISDRAfee,
} from '../utils/misc';

interface Props extends FormikProps<InitialFormValues> {
  event: Event | undefined;
}

export default function RegistrationForm(props: Props) {
  const errorsRef = React.useRef<HTMLDivElement>(null);
  const [summary, setSummary] = React.useState({
    subtotal: 0,
    isdraFee: 0,
    trailFee: 0,
    total: 0,
  });

  React.useEffect(() => {
    if (props.event?.races) {
      setSummary(
        calculateRegistrationSummary(props.values.races, props.event.races)
      );
    }
  }, [props.values.races]);

  React.useEffect(() => {
    if (props.isValid) return;

    if (Object.keys(props.errors).length > 0) {
      errorsRef.current?.scrollIntoView();
    }
  }, [props.submitCount]);

  return (
    <RegistrationFormStyles>
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
                  {props.values.races.length < 1 ? (
                    <div className="item">
                      <Field as="select" name="races.0" id="races.0">
                        <option value="">Select a race</option>
                        {props.event?.races.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.sled} - {r.category}
                            {r.breed ? ` - ${r.breed}` : null} -{' '}
                            {formatToMoney(r.price)}
                          </option>
                        ))}
                      </Field>
                    </div>
                  ) : (
                    <>
                      {props.values.races.map((race, index) => (
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
                              <span className="sr-only">Remove this race</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {props.values.races.length > 0 &&
                  props.values.races[props.values.races.length - 1] !== '' ? (
                    <div className="add-race-row">
                      <button
                        type="button"
                        onClick={() =>
                          arrayHelpers.insert(props.values.races.length, '')
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
          <div className="grid-cols-2">
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
          {props.values.age && Number(props.values.age) < 18 ? (
            <div className="item">
              <label htmlFor="guardian">Guardian</label>
              <Field name="guardian" id="guardian" />
              <ErrorMessage
                component="div"
                name="guardian"
                className="validation-error"
              />
            </div>
          ) : null}
        </div>
        <div className="review-registration section">
          <h3>
            <span>Review your registration</span>
          </h3>
          {props.values.races.length > 0 ? (
            <div className="selected-races">
              <h4>Selected race{props.values.races.length > 1 ? 's' : ''}</h4>
              <div>
                {props.values.races.map(r => {
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
              <div className="registration-summary">
                <h4>Registration summary</h4>
                <div className="summary-item">
                  <div className="summary-label">Subtotal:</div>
                  <div className="summary-value">
                    {formatToMoney(summary.subtotal, true)}
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Trail fee:</div>
                  <div className="summary-value">
                    {formatToMoney(summary.trailFee, true)}
                  </div>
                </div>
                {includeISDRAfee(props.values.races, props?.event?.races) ? (
                  <div className="summary-item">
                    <div className="summary-label">ISDRA fee:</div>
                    <div className="summary-value">
                      {formatToMoney(summary.isdraFee, true)}
                    </div>
                  </div>
                ) : null}
                <div className="summary-item total">
                  <div className="summary-label">Total:</div>
                  <div className="summary-value">
                    {formatToMoney(summary.total, true)}
                  </div>
                </div>
              </div>
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h4>No races selected</h4>
              <p>You need to select at least 1 race to register.</p>
            </div>
          )}
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
            <pre>Stripe input will go here...</pre>
          </div>
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
              'Submit your registration'
            )}
          </button>
        </div>
        {props.submitCount > 0 && Object.keys(props.errors).length > 0 ? (
          <div ref={errorsRef} className="errors-list">
            <h4>
              <span>Errors to fix before submitting</span>
            </h4>
            <div className="validation-errors">
              {Object.keys(props.errors).map(e => (
                <div key={e} className="error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {props.errors[e as keyof InitialFormValues]}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Form>
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

  .birthday-grid {
    display: grid;
    grid-template-columns: repeat(3, calc(33.3333% - 0.667rem));
    gap: 1rem;
  }

  .item {
    margin: 1.25rem 0 0;
    display: flex;
    flex-direction: column;
  }

  .selected-races {
    margin: 1.75rem 0 0;

    h4 {
      font-size: 1rem;
      font-weight: 600;
    }
  }

  .selected-race {
    padding: 0.625rem 0;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    border-bottom: 1px solid #d1d5db;

    &:first-of-type {
      margin: 0.875rem 0 0;
      border-top: 1px solid #d1d5db;
    }
  }

  .no-races-selected {
    margin: 1.5rem 0;
    padding: 0.875rem 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

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

  .registration-summary {
    margin: 1.875rem 0 0;

    h4 {
      font-size: 1rem;
      font-weight: 600;
    }
  }

  .summary-item {
    padding: 0.25rem 0;
    display: flex;
    justify-content: space-between;

    &:first-of-type {
      margin: 0.4375rem 0 0;
    }
  }

  .summary-label,
  .summary-value {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #374151;
  }

  .total {
    .summary-label,
    .summary-value {
      font-weight: 600;
      color: #111827;
    }
  }

  .actions {
    margin: 1.5rem 0 0;
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

  .errors-list {
    h4 {
      position: relative;
      margin: 2rem 0 0;
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;
      text-align: center;
      line-height: 1.65;
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
  }

  .validation-errors {
    margin: 1.25rem 0 0;
    padding: 0.25rem 1rem;
    display: flex;
    flex-direction: column;
    background-color: #fff1f2;
    border: 1px solid #fecdd3;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

    .error {
      padding: 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #9f1239;
      font-size: 0.875rem;
      font-weight: 500;
      border-bottom: 1px solid #fad1d6;

      &:last-of-type {
        border-bottom: none;
      }

      svg {
        height: 0.8125rem;
        width: 0.8125rem;
        color: #be123c;
      }
    }
  }

  .validation-error {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #be123c;
    line-height: 1.5;
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
