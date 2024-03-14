import { AUTH_FORM_CONSTANTS } from '../../../utils/constants'
import InputForm from '../../elements/InputForm'

function FormLogin() {
  return (
    <>
      {AUTH_FORM_CONSTANTS.LOGIN.map((input, index) => (
        <InputForm key={index} {...input} required={true} />
      ))}

      <button
        type="button"
        aria-label='lupa password?'
        className='w-max self-end text-sm mt-1 text-blue-700'>
        Lupa password ?
      </button>
    </>
  )
}

export default FormLogin