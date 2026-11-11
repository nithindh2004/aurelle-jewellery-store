import { Minus, Plus } from 'lucide-react';
import { MAX_QUANTITY } from '../data/store';
import './QuantityStepper.css';

/**
 * − value + control. Limits use aria-disabled (not `disabled`) so keyboard
 * focus stays on the button when the quantity reaches its minimum or maximum.
 */
export default function QuantityStepper({ value, onChange, label, min = 1, max = MAX_QUANTITY }) {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div className="stepper" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        onClick={() => !atMin && onChange(value - 1)}
        aria-disabled={atMin}
        aria-label={`Decrease quantity of ${label}`}
      >
        <Minus size={14} aria-hidden="true" />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => !atMax && onChange(value + 1)}
        aria-disabled={atMax}
        aria-label={`Increase quantity of ${label}`}
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
