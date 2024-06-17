import PropTypes from 'prop-types'
import { useState } from 'react'
import { deleteProductsCart, editQty } from '../../lib/firebase/services/cartFirebase'
import { auth } from '../../lib/firebase/init'
import { calculateNewQty } from '../../services/cartServices'
import TrashIcon from '../../assets/icons/trash.svg'
import MinusIcon from '../../assets/icons/minus.svg'
import PlusIcon from '../../assets/icons/plus.svg'
import { useUser } from '../../hooks'
import Swal from 'sweetalert2'
import { Toast, confirmDeleteCartsProduct } from '../../lib/sweetalert2/init'

function InputQty({ handleClickBtnQty, product, idSeller, setCartsData, setProductsReadyToCheckout }) {
  const [qty, setQty] = useState(product?.qty)
  const { userInfo } = useUser()

  const handleBtnQty = async (action) => {
    try {
      await handleClickBtnQty(action, idSeller, product.idCart)
      const newQty = calculateNewQty(action, product.qty)
      setQty(String(newQty))

      if (product.isReady) {
        setProductsReadyToCheckout(prev => {
          const newCart = prev.products.find(cart => cart.uids === idSeller)
          newCart.products = newCart.products.map(item => {
            if (item.idCart === product.idCart) {
              return ({
                ...item,
                qty: newQty
              })
            }
            return item
          })

          const products = prev.products.map(cart => {
            if (cart.uids === idSeller) return newCart
            return cart
          })

          const prices = products.map(cart => {
            return cart.products.map(product => product.price * product.qty)
          }).flat()

          return {
            products,
            totalproducts: prices.length,
            totalPrice: prices.length === 0 ? 0 :
              prices.reduce((acc, curr) => parseInt(acc) + parseInt(curr))
          }
        })
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const handleChange = (e) => {
    let value = e.target.value.replace(/^0+/, '')

    if (value < 0 || value.includes('-0')) value = 1
    if (value > 50) value = 50
    setQty(value)
  }

  const handleBlur = async (e) => {
    try {
      let value = e.target.value

      if (value === '' || value.includes('-0')) {
        value = 1
        setQty(String(1))
      }

      if (value == product.qty) return;

      setCartsData(prevData => {
        return prevData.map(cart => {
          if (cart.uids === idSeller) {
            return ({
              ...cart, products: cart.products.map(item => {
                if (item.idCart === product.idCart) {
                  return ({ ...item, qty: value })
                }
                return item
              })
            })
          }
          return cart
        })
      })

      if (product.isReady) {
        setProductsReadyToCheckout(prev => {
          const newCart = prev.products.find(cart => cart.uids === idSeller)

          newCart.products = newCart.products.map(item =>
            item.idCart === product.idCart ?
              ({ ...item, qty: value }) : item)

          const products = prev.products.map(cart => {
            if (cart.uids === idSeller) return newCart
            return cart
          })

          const prices = products.map(cart => {
            return cart.products.map(product => product.price * product.qty)
          }).flat()

          return {
            products,
            totalproducts: prices.length,
            totalPrice: prices.length === 0 ? 0 :
              prices.reduce((acc, curr) => Number(acc) + Number(curr))
          }
        })
      }

      await editQty({
        email: auth.currentUser.email,
        idCart: product.idCart,
        qty: value,
        uids: idSeller,
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const { isConfirmed } = await Swal.fire(confirmDeleteCartsProduct)
      if (!isConfirmed) return;

      const deleteResponse = await deleteProductsCart({ email: userInfo.email, uids: idSeller, idCart: product.idCart })
      if (deleteResponse.success) {

        if (product.isReady) {
          setProductsReadyToCheckout(prevData => {
            let cart = prevData.products.find(cart => cart.uids === idSeller)
            if (cart) {
              cart.products = cart.products.filter(item => item.idCart !== product.idCart)

              if (cart.products.length === 0) return ({ products: [], totalPrice: 0, totalproducts: 0 })

              cart.totalProducts = cart.products.length

              let newCarts = prevData.products.map(data => data.uids === idSeller ? cart : data)

              const newPrices = newCarts
                .map((cart) => {
                  return cart.products.map((product) => product.price * product.qty);
                })
                .flat();

              const newTotalProducts = newPrices.length

              return ({ totalPrice: newPrices.reduce((acc, curr) => acc + curr), products: newCarts, totalproducts: newTotalProducts })
            }
          })
        }

        setCartsData(prevData => {
          let cart = prevData.find(cart => cart.uids === idSeller)
          cart.products = cart.products.filter(item => item.idCart !== product.idCart)
          cart.totalproducts = cart.products.length

          if (cart.products.length === 0) cart = null

          if (cart) {
            const newData = prevData.map(data => data.uids === idSeller ? cart : data)
            return newData
          } else {
            const newData = prevData.filter(data => data.uids !== idSeller)
            return newData
          }
        })

        Toast.fire({
          icon: 'success',
          title: "Berhasil menghapus produk dari keranjang belanja",
        })
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="relative flex items-center max-w-36">
      <button type="button" onClick={() => (qty - 1) < 1 ? handleDelete() : handleBtnQty('dec')} aria-label='kurangi kuantiti' id={`decrement-button-${product?.idCart}`} className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg px-3 h-6 sm:h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
        {(qty - 1) < 1 ? (
          <img src={TrashIcon} alt="ikon hapus" width={55} height={55} />
        ) : (
          <img src={MinusIcon} alt="ikon minus" width={55} height={55} />
        )}
      </button>
      <input type="number" value={qty} onBlur={handleBlur} onChange={handleChange} minLength={1} maxLength={50} id={`quantity-input-${product?.idCart}`} className="bg-gray-50 border-x-0 border-gray-300 h-6 sm:h-8 text-center text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-y" placeholder="1" required />
      <button type="button" onClick={() => handleBtnQty('inc')} aria-label='tambah kuantiti' id={`increment-button-${product?.idCart}`} className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg px-3 h-6 sm:h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
        <img src={PlusIcon} alt="ikon minus" width={55} height={55} />
      </button>
    </div>
  )
}

InputQty.propTypes = {
  handleClickBtnQty: PropTypes.func,
  product: PropTypes.object,
  idSeller: PropTypes.string,
  setCartsData: PropTypes.func,
  setProductsReadyToCheckout: PropTypes.func,
  cartsData: PropTypes.array,
}

export default InputQty
