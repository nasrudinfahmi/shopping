import PropTypes from 'prop-types'

function BtnSubmitAuth({ children, className }) {
  return (
    <button type="submit" aria-label='Masuk' className={`border py-1 mt-4 ${className}`}>
      {children}
    </button>
  )
}

BtnSubmitAuth.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string.isRequired,
}

export default BtnSubmitAuth
