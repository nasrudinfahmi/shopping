import { useEffect, useState } from "react"
import { useContext } from "react"
import { EditorContext } from "../context/editorjs/editorContext"
import { UserContext } from "../context/user/UserContext"
import { SellerContext } from "../context/seller/SellerContext"

const useResizeWindow = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const onResizeWidth = () => {
    return setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', onResizeWidth)

    return () => {
      window.removeEventListener('resize', onResizeWidth)
    }
  }, [])

  return { windowWidth }
}

const useEditor = () => {
  const { initEditor, editorInstanceRef } = useContext(EditorContext)
  return { initEditor, editorInstanceRef }
}

const useUser = () => {
  const { userInfo, setUserInfo, loading, logoutCallback, deleteUserCallback } = useContext(UserContext)
  return {
    userInfo,
    setUserInfo,
    loading,
    logout: logoutCallback,
    deleteAccount: deleteUserCallback
  }
}

const useSeller = () => {
  const { seller, setSeller, loading } = useContext(SellerContext)
  return { seller, setSeller, loading }
}

export { useResizeWindow, useEditor, useUser, useSeller }