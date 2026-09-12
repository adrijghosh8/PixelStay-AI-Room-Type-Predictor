import '../styles/inputField.css';

export default function InputField({
  id,
  label,
  unit,
  hint,
  error,
  prefix,
  ...inputProps
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {unit && <span className="field__unit"> ({unit})</span>}
      </label>

      <div className="field__control">
        {prefix && <span className="field__prefix">{prefix}</span>}
        <input
          id={id}
          className="field__input"
          aria-describedby={[hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          {...inputProps}
        />
      </div>

      {hint && !error && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
