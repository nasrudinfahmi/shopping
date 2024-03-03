import PropTypes from 'prop-types'
import { useEffect } from "react"
import { useUser } from "../../hooks"
import { useNavigate } from "react-router-dom"
import { Outlet } from 'react-router-dom'

function ProtectedRoute({ path }) {
  const { userInfo, loading } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (userInfo && path === '/auth') {
        return navigate('/', { replace: true })
      }

      if (!userInfo && path !== 'auth') {
        return navigate('/auth', { replace: true })
      }
    }
  }, [userInfo, loading, path, navigate])


  if (loading) return <h1>loading bos!</h1>
  if (!loading && !userInfo && path !== '/auth') return <h1>loading bos!</h1>
  if (!loading && userInfo && path === '/auth') return <h1>loading bos!</h1>
  return <>{<Outlet />}</>
}

ProtectedRoute.propTypes = {
  path: PropTypes.string,
}

export default ProtectedRoute