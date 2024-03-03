import PropTypes from "prop-types";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { auth } from "../../lib/firebase/init";
import { deleteAccount, deleteDataUser, getDataUser, logout } from "../../lib/firebase/service";
import { onAuthStateChanged } from "firebase/auth";

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
    if (auth.currentUser) {
      deleteDataUser(auth.currentUser.email)
        .then(async () => {
          deleteAccount(auth.currentUser)
            .then(() => {
              auth.updateCurrentUser(null)
              localStorage.removeItem('user')
              setUserInfo(null)
              console.log('Berhasil menghapus akun.')
            })
            .catch((error) => console.log(error.message))
        })
        .catch((error) => console.log(error.message))
    }
  }, [])

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
