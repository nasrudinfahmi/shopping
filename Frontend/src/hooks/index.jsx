import { useEffect, useState } from "react"

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

export { useResizeWindow }