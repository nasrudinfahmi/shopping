import PropTypes from 'prop-types'

function BtnSubmit({ children, className, isLoading }) {

  return (
    <button disabled={isLoading} title={children} type="submit" aria-label={children} className={`flex items-center justify-center gap-2 border py-1 ${className} disabled:bg-slate-50/50`}>
      {isLoading && (
        <span className='block animate-spin anima w-4 h-4 rounded-full border-2 border-slate-500 border-t-transparent' />
      )}
      {isLoading ? `loading ...` : children}
    </button>
  )
}

BtnSubmit.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default BtnSubmit
