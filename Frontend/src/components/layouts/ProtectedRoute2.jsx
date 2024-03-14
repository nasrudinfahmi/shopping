import PropTypes from 'prop-types'
import { Navigate, Outlet } from "react-router-dom"
import { useSeller, useUser } from "../../hooks"
import { auth } from "../../lib/firebase/init"

function ProtectedRoute2() {
  const { seller, loading } = useSeller()
  const { userInfo } = useUser()
  const role = userInfo?.role;
  const uids = userInfo?.uids;

  if (loading) return <h1>Loading bos!</h1>
  if (!loading) {
    // jika pengguna belum login dan mengakses route yang dilindungi
    if (!userInfo && !auth.currentUser) return <Navigate to="/auth" replace />

    // jika pengguna adalah seller dan mengakses route khusus seller
    if (role === 'seller' && uids && seller) return <Outlet />

    // jika pengguna bukan seller dan mengakses route khusus seller
    if (role === 'user' && !uids && !seller) return <Navigate to="/" replace />
  }
}

ProtectedRoute2.propTypes = {
  path: PropTypes.string,
}

export default ProtectedRoute2