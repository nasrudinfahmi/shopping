import { useEffect, useState } from "react"
import { useContext } from "react"
import { EditorContext } from "../context/editorjs/editorContext"

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

export { useResizeWindow, useEditor }