import { AUTH_FORM_CONSTANTS } from '../../../utils/constants'
import BtnSubmitAuth from '../../elements/BtnSubmitAuth'
import InputForm from '../../elements/InputForm'

function FormRegister() {
  return (
    <>
      {AUTH_FORM_CONSTANTS.REGISTER.map((input, index) => (
        <InputForm key={index} {...input} />
      ))}

      <BtnSubmitAuth>
        Daftar
      </BtnSubmitAuth>
    </>
  )
}

export default FormRegister