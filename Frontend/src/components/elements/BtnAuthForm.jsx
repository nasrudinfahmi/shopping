import PropTypes from 'prop-types'

function BtnAuthForm({ login, onClick, children }) {
  return (
    <button type="button" className={`py-px sm:py-1 px-3 ${login && 'bg-green-600 text-white'}`} aria-label='tombol masuk' onClick={onClick}>{children}</button>
  )
}

BtnAuthForm.propTypes = {
  login: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired
}

export default BtnAuthForm
