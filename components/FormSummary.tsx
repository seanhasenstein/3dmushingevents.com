import React from 'react';
import styled from 'styled-components';
import { Event, InitialFormValues } from '../interfaces';
import {
  calculateRegistrationSummary,
  formatToMoney,
  includeISDRAfee,
} from '../utils/misc';

type Props = {
  values: InitialFormValues;
  event: Event | undefined;
};

export default function FormSummary(props: Props) {
  const [summary, setSummary] = React.useState({
    subtotal: 0,
    isdraFee: 0,
    trailFee: 0,
    total: 0,
  });

  // update summary
  React.useEffect(() => {
    if (props.event?.races) {
      setSummary(
        calculateRegistrationSummary(
          props.values.races,
          props.event.races,
          props.event.isdraRaceFee,
          props.event.trailFee
        )
      );
    }
  }, [props.values.races]);

  return (
    <FormSummaryStyles>
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
    </FormSummaryStyles>
  );
}

const FormSummaryStyles = styled.div`
  margin: 1.5rem 0 0;

  h4 {
    font-size: 1rem;
    font-weight: 600;
  }

  .summary-item {
    padding: 0.25rem 0;
    display: flex;
    justify-content: space-between;

    &:first-of-type {
      margin: 0.5rem 0 0;
    }
  }

  .summary-label,
  .summary-value {
    font-size: 0.875rem;
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
`;
