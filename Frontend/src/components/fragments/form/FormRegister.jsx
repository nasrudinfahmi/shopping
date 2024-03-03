import { AUTH_FORM_CONSTANTS } from '../../../utils/constants'
import InputForm from '../../elements/InputForm'

function FormRegister() {
  return (
    <>
      {AUTH_FORM_CONSTANTS.REGISTER.map((input, index) => (
        <InputForm key={index} {...input} />
      ))}
    </>
  )
}

export default FormRegister