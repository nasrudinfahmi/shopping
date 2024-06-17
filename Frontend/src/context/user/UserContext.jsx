import PropTypes from "prop-types";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { auth, provider } from "../../lib/firebase/init";
import { logout } from '../../lib/firebase/services/authFirebase'
import { deleteDataUser, getDataUser } from '../../lib/firebase/services/userFirestore'
import { EmailAuthProvider, deleteUser, onAuthStateChanged, reauthenticateWithCredential, reauthenticateWithRedirect } from "firebase/auth";
import { deleteFileFromStorage } from "../../lib/firebase/services/storage";
import Swal from "sweetalert2";
import { confirmDeleteAccount, modalInputPasswordOpt } from "../../lib/sweetalert2/init";
import { deleteSeller } from "../../lib/firebase/services/sellerFirestore";
import { deleteAllSellersProducts } from "../../lib/firebase/services/productFirebase";

export const UserContext = createContext();

function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user') || auth.currentUser || null));
  const [loading, setLoading] = useState(false)
  const fetcheDataUser = useRef()
  fetcheDataUser.current = false;

  useEffect(() => {
    setLoading(true)
    const userDataFromLocalStorage = JSON.parse(localStorage.getItem('user')) || null;
    if (!fetcheDataUser.current) {
      if (!userDataFromLocalStorage) {
        onAuthStateChanged(auth, async user => {
          if (!userDataFromLocalStorage && user) {
            (async function () {
              const userData = await getDataUser(user.email)
              if (userData) {
                setUserInfo(userData.data.data.userData)
                return localStorage.setItem('user', JSON.stringify(userData.data.data.userData))
              }
            })()
          }
        })
      }
    }
    fetcheDataUser.current = true;
    setLoading(false)
  }, [])


  const logoutCallback = useCallback(async () => {
    try {
      await logout()
      auth.updateCurrentUser(null)
      setUserInfo(null)
      localStorage.removeItem('user')
      console.log('logout berhasil');
      return;
    } catch (error) {
      console.log(error.message)
    }
  }, [])

  const deleteUserCallback = useCallback(async () => {
    try {
      if (auth.currentUser && userInfo) {
        const userPhotoProfile = JSON.parse(localStorage.getItem('user'))?.photoURL;
        const providerId = auth.currentUser.providerData[0].providerId;

        const modalConfirm = await Swal.fire(confirmDeleteAccount);

        if (!modalConfirm.isConfirmed) return false;

        if (providerId === 'google.com') {
          await reauthenticateWithRedirect(auth.currentUser, provider)
        }

        if (providerId === 'password') {
          const { value: password } = await Swal.fire(modalInputPasswordOpt);

          if (!password) return false;
          const credentials = EmailAuthProvider.credential(auth.currentUser.email, password)

          const userCreds = await reauthenticateWithCredential(auth.currentUser, credentials)

          if (userCreds) {
            let promises = [
              deleteUser(auth.currentUser),
              deleteFileFromStorage(userPhotoProfile),
              deleteDataUser(userInfo.email),
            ]

            if (userInfo?.uids && userInfo.role === "seller") {
              console.log('masuk sini')
              promises.push(deleteSeller(userInfo.uids), deleteAllSellersProducts(userInfo.uids))
            }

            console.log(promises)
            await Promise.all(promises)

            auth.updateCurrentUser(null)
            localStorage.removeItem('user')
            setUserInfo(null)
            console.log('Berhasil menghapus akun.')

            Swal.fire({
              icon: "success",
              title: "Akun berhasil dihapus",
              text: "Jangan lupa untuk menjaga semangatmu yah 😇",
            });

            return true;
          }
        }
      }
    } catch (error) {
      let errMessage = error.message;

      if (errMessage === 'Firebase: Error (auth/invalid-login-credentials).') {
        errMessage = 'Password salah!'
      }

      console.log(errMessage)
      throw new Error(errMessage)
    }
  }, [userInfo])

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, loading, logoutCallback, deleteUserCallback }}>
      {children}
    </UserContext.Provider>
  )
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export default UserContextProvider;
