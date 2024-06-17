import PropTypes from 'prop-types'
import { useSeller, useUser } from "../../hooks"
import { Outlet, Navigate } from 'react-router-dom'
import { auth } from '../../lib/firebase/init'
import Loading from '../elements/Loading'

function ProtectedRoute({ path }) {
  const { userInfo } = useUser()
  const uids = userInfo?.uids;
  const role = userInfo?.role;
  const { loading, seller } = useSeller()

  if (loading) return <Loading />

  // user tidak bisa akses /auth ketika sudah login
  if (userInfo && path === '/auth') return <Navigate to="/" replace />

  // user belum login dan mengakses route /auth
  if (!auth.currentUser && !userInfo && path === '/auth') return <Outlet />

  // user tidak bisa akses route /auth ketika sudah login
  if (auth.currentUser && userInfo && path === '/auth') return <Navigate to="/" replace />

  // user tidak bisa akses route yang dilindungi jika belum login
  if (!auth.currentUser && !userInfo && path !== 'auth') return <Navigate to="/auth" replace />

  // user TIDAK punya toko dan mengakses route buka toko (/mystore)
  if (!uids && role === 'user' && !seller && path === '/mystore') return <Outlet />

  // user SUDAH punya toko dan mengakses route buka toko (/mystore)
  if (uids && role === 'seller' && seller && path === '/mystore') return <Navigate to="/dashboard" replace />

  // user belum login tapi mengakses route yang tidak dilindungi
  return <Outlet />
}

ProtectedRoute.propTypes = {
  path: PropTypes.string,
}

export default ProtectedRoute