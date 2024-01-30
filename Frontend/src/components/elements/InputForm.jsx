import PropTypes from 'prop-types'

function InputForm({ icon, id, type, placeholder }) {
  return (
    <label htmlFor={id} className='mt-2 block'>
      <span className='mb-px block text-sm font-semibold text-slate-700'>{id}</span>
      <div className='flex items-center border rounded'>
        <span className='p-2 border-r'>
          <img src={icon} alt="ikon email" width={24} height={24} />
        </span>
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          aria-label={`kolom ${type}`}
          spellCheck={false}
          autoComplete='off'
          className="w-full border-none outline-none py-1 px-3" />
      </div>
    </label>
  )
}

InputForm.propTypes = {
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
}

export default InputForm
