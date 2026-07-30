function FormField({ label, name, type = 'text', ...props }) {
  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <input id={name} name={name} type={type} {...props} />
    </div>
  )
}

export default FormField
