import { AUTH_FORM_CONSTANTS } from '../../../utils/constants'
import BtnSubmitAuth from '../../elements/BtnSubmitAuth'
import InputForm from '../../elements/InputForm'

function FormLogin() {
  return (
    <>
      {AUTH_FORM_CONSTANTS.LOGIN.map((input, index) => (
        <InputForm key={index} {...input} />
      ))}

      <button
        type="button"
        aria-label='lupa password?'
        className='w-max self-end text-sm mt-1 text-blue-700'>
        Lupa password ?
      </button>
      <BtnSubmitAuth>
        Masuk
      </BtnSubmitAuth>
    </>
  )
}

export default FormLogin