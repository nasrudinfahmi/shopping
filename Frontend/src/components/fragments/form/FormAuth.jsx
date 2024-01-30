import Logo from "../../elements/Logo"
import BtnToggleAuthForm from "../../elements/BtnToggleAuthForm"
import FormLogin from "./FormLogin"
import FormRegister from "./FormRegister"
import BtnLoginGoogle from "../../elements/BtnLoginGoogle"
import { useState } from "react"

function FormAuth() {
  const [login, setLogin] = useState(true)

  return (
    <form className="m-auto flex flex-col border rounded-md shadow p-4 md:p-8 lg:p-10 xl:p-12 sm:w-1/2 lg:w-2/5 xl:w-1/3 bg-white">
      <span className='mx-auto block mb-5 pt-2 '>
        <Logo />
      </span>
      <BtnToggleAuthForm login={login} setLogin={setLogin} />

      {login ? <FormLogin /> : <FormRegister />}

      <div className='text-center relative custom-line mt-5'>atau</div>
      <BtnLoginGoogle />
    </form>
  )
}

export default FormAuth