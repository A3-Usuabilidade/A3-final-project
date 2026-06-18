export default function FormField({ label, name, type = 'text', value, onChange, placeholder, error, disabled, required, register, className = '' }) {
  const id = name;
  const inputProps = {
    id,
    type,
    placeholder,
    disabled,
    required,
    className: `w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder-on-surface-variant transition-colors focus:border-primary focus:outline-none ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${error ? 'border-error' : ''} ${className}`,
  };

  if (register) {
    Object.assign(inputProps, register);
  } else {
    inputProps.value = value ?? '';
    inputProps.onChange = onChange;
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm text-on-surface-variant mb-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea {...inputProps} type={undefined} />
      ) : (
        <input {...inputProps} />
      )}
      {error && (
        <span className="text-error text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
}
