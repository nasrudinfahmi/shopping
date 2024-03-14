import PropTypes from 'prop-types'
import { createContext, useEffect, useState } from 'react'
import { auth } from '../../lib/firebase/init'
import { useUser } from '../../hooks'
import { getSeller } from '../../lib/firebase/services/sellerFirestore'
import { Navigate } from 'react-router-dom'

export const SellerContext = createContext(null)

function SellerContextProvider({ children }) {
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const { userInfo } = useUser();
  const uids = userInfo?.uids;
  const role = userInfo?.role;

  useEffect(() => {
    (async function () {
      setLoading(true)
      try {
        if (uids && role === 'seller') {
          const sellerResponse = await getSeller(uids)
          setSeller(sellerResponse.data)
        }
      } catch (error) {
        console.log(error.message)
      }
      setLoading(false)
    })()
  }, [role, uids])

  if (!auth.currentUser) <Navigate to="/" replace />

  return (
    <SellerContext.Provider value={{ seller, setSeller, loading }}>
      {loading ? 'Loading bos!' : children}
    </SellerContext.Provider>
  )
}

SellerContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SellerContextProvider
