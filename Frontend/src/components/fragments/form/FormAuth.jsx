import Logo from "../../elements/Logo"
import BtnToggleAuthForm from "../../elements/BtnToggleAuthForm"
import FormLogin from "./FormLogin"
import FormRegister from "./FormRegister"
import BtnLoginGoogle from "../../elements/BtnLoginGoogle"
import BtnSubmitAuth from '../../elements/BtnSubmitAuth'
import { useCallback, useEffect, useState } from "react"
import { handleAuthUser } from "../../../services/auth"
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom"
import { auth } from "../../../lib/firebase/init"
import { getRedirectResult, updateProfile } from "firebase/auth"
import { useUser } from "../../../hooks"
import { createDataUser, getDataUser, updateDataUser } from "../../../lib/firebase/service"
import { FIREBASE_ERROR } from "../../../utils/constants"


function FormAuth() {
  const [login, setLogin] = useState(true)
  const [errMsg, setErrMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setUserInfo } = useUser()

  const navigate = useNavigate()

  useEffect(() => setErrMsg(''), [login])

  const handleSubmitAuth = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const userData = await handleAuthUser(login)

      setErrMsg('')
      if (userData && login) toast.success('Login berhasil')
      if (userData && !login) toast.success('Register berhasil')

      setUserInfo(userData)
      setIsLoading(false)
    } catch (error) {
      const errMessage = FIREBASE_ERROR.find(err => {
        if (err.error === error.message) return err;
      })?.message || error.message;

      toast.error(errMessage)
      setErrMsg(errMessage)
      setIsLoading(false)
      console.log(errMessage);
    }
  }


  const createUserProfile = useCallback(async (user, userData) => {
    if (user && !userData) {
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
      };

      await createDataUser(userData)

      localStorage.setItem("user", JSON.stringify(userData));
      setUserInfo(userData);
      navigate('/', { replace: true })
    }
  }, [navigate, setUserInfo])

  const updateUserProfile = useCallback(async (user, userData) => {
    if (user && userData) {
      let dataToUpdate = {};
      let dataProfile = {};

      if (user.photoURL && !userData.photoURL) {
        dataToUpdate.photoURL = user.photoURL;
      }

      if (!user.photoURL && userData.photoURL) {
        dataProfile.photoURL = userData.photoURL;
      }

      if (user.displayName && !userData.displayName) {
        dataToUpdate.displayName = user.displayName;
      }

      if (!user.displayName && userData.displayName) {
        dataProfile.displayName = userData.displayName;
      }

      if (user.emailVerified && !userData.emailVerified) {
        dataToUpdate.emailVerified = user.emailVerified;
      }

      // update data user di database
      if (Object.keys(dataToUpdate).length > 0) {
        await updateDataUser(user.email, dataToUpdate);
      }

      // update data user pada current user firebase
      if (Object.keys(dataProfile).length > 0) {
        await updateProfile(user, dataProfile);
      }

      localStorage.setItem("user", JSON.stringify(userData));
      setUserInfo(userData);
      navigate('/', { replace: true })
    }
  }, [navigate, setUserInfo])

  useEffect(() => {
    (async function () {
      const userCreds = await getRedirectResult(auth);
      const user = userCreds?.user;

      if (user) {
        setIsLoading(true)
        toast.success('login berhasil.')

        const userData =
          JSON.parse(localStorage.getItem("user")) ||
          (await getDataUser(user.email))?.data?.data?.userData;

        if (!userData) {
          await createUserProfile(user, userData)
        } else {
          await updateUserProfile(user, userData)
        }
      }
      setIsLoading(false)
    })()
  }, [createUserProfile, navigate, setUserInfo, updateUserProfile])


  return (
    <form
      onSubmit={handleSubmitAuth}
      className="m-auto flex flex-col border rounded-md shadow p-4 md:p-8 lg:p-10 xl:p-12 sm:w-1/2 lg:w-2/5 xl:w-1/3 bg-white">
      <span className='mx-auto block mb-5 pt-2'>
        <Logo />
      </span>
      <BtnToggleAuthForm login={login} setLogin={setLogin} />

      {errMsg && (
        <span className="block w-full text-center text-sm lg:text-base text-red-500 font-semibold">{errMsg}</span>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={true}
        theme="colored"
        transition={Bounce}
        draggablePercent={60}
        closeOnClick
        role="alert"
      />

      {login ? <FormLogin /> : <FormRegister />}
      <BtnSubmitAuth isLoading={isLoading}>
        {login ? 'Masuk' : 'Daftar'}
      </BtnSubmitAuth>

      <div className='text-center relative custom-line mt-5'>atau</div>
      <BtnLoginGoogle />
    </form>
  )
}

export default FormAuth