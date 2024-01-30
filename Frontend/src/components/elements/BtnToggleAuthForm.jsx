import PropTypes from 'prop-types'
import BtnAuthForm from './BtnAuthForm'

function BtnToggleAuthForm({ login, setLogin }) {
  return (
    <div className='border w-max mx-auto mb-4 rounded-md overflow-hidden'>
      <BtnAuthForm login={login} onClick={() => setLogin(true)}>
        Masuk
      </BtnAuthForm>
      <BtnAuthForm login={!login} onClick={() => setLogin(false)}>
        Daftar
      </BtnAuthForm>
    </div>
  )
}

BtnToggleAuthForm.propTypes = {
  login: PropTypes.bool.isRequired,
  setLogin: PropTypes.func.isRequired
}

export default BtnToggleAuthForm
