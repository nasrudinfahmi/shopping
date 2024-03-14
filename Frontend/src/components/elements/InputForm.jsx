import PropTypes from 'prop-types'

function InputForm({ icon, id, type, placeholder, optional, required, multiple, accept, onChange }) {
  return (
    <label htmlFor={id} className='mt-2 block'>
      <span className='mb-px flex text-sm font-semibold text-slate-700'>
        {id}
        {optional ? <span className='block ml-1 font-normal'>(opsional)</span> : ''}
      </span>
      <div className='flex items-center border rounded'>
        {icon && (
          <span className='p-2 border-r'>
            <img src={icon} alt="ikon email" width={24} height={24} />
          </span>
        )}
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          aria-label={`kolom ${type}`}
          spellCheck={false}
          autoComplete='off'
          required={required}
          multiple={multiple}
          accept={accept}
          onChange={onChange}
          title={id}
          className="w-full border-none outline-none py-1 px-3 rounded" />
      </div>
    </label>
  )
}

InputForm.propTypes = {
  icon: PropTypes.string,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  optional: PropTypes.bool,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  onChange: PropTypes.func,
}

InputForm.defaultProps = {
  required: false,
  multiple: false,
  accept: '*',
}

export default InputForm
