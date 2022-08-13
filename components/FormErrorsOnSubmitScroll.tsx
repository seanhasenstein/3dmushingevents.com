import React from 'react';
import { FormikErrors } from 'formik';
import { InitialFormValues } from '../interfaces';
import styled from 'styled-components';

type Props = {
  errors: FormikErrors<InitialFormValues>;
  errorsRef: React.RefObject<HTMLDivElement>;
  isValid: boolean;
  submitCount: number;
};

export default function FormErrorsOnSubmitScroll(props: Props) {
  // scroll to bottom if there are validation errors
  // when submit button is clicked to inform user
  React.useEffect(() => {
    if (props.isValid) return;

    if (Object.keys(props.errors).length > 0) {
      props.errorsRef.current?.scrollIntoView();
    }
  }, [props.submitCount]);

  return (
    <>
      {props.submitCount > 0 && Object.keys(props.errors).length > 0 ? (
        <FormErrorsOnSubmitStyles ref={props.errorsRef}>
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
        </FormErrorsOnSubmitStyles>
      ) : null}
    </>
  );
}

const FormErrorsOnSubmitStyles = styled.div`
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
`;
