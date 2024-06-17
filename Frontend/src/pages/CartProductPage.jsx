import NavBottomCartPage from "../components/fragments/navbar/NavbarBottom/NavBottomCartPage"
import NavbarTop2 from "../components/fragments/navbar/NavbarTop/NavbarTop2"
import { useResizeWindow, useUser } from "../hooks"
import { useEffect, useState } from "react"
import { formattedIDR } from "../utils/utils"
import CheckboxProduct from "../components/elements/CheckboxProduct"
import NavbarTop from '../components/fragments/navbar/NavbarTop/NavbarTop'
import { calculateNewQty, fetchCartData, toggleCheck, toggleCheckAll } from "../services/cartServices"
import { editQty } from "../lib/firebase/services/cartFirebase"
import { auth } from "../lib/firebase/init"
import CartsCard from "../components/fragments/card/CartsCard"
import { Link, useNavigate } from "react-router-dom"
import Loading from "../components/elements/Loading"
import LeftIcon from '../assets/icons/arrowLeft.svg'


function CartProductPage() {
  const { windowWidth } = useResizeWindow()
  const [cartsData, setCartsData] = useState([])
  const [checkedAll, setCheckedAll] = useState(false)
  const [productsReadyToCheckout, setProductsReadyToCheckout] = useState({})
  const [loading, setLoading] = useState(true)
  const { userInfo } = useUser()
  const navigate = useNavigate()

  const handleClickBtnQty = async (action, idSeller, idCart) => {
    try {
      const newCart = cartsData.find(cart => cart.uids === idSeller)
      let productToChange;
      let qty;

      const newProducts = newCart.products.map(product => {
        if (product.idCart === idCart) {
          let quantity = calculateNewQty(action, product.qty)

          productToChange = product
          qty = quantity
          return ({ ...product, qty: quantity })
        }
        return product
      })

      setCartsData(prevCartData => {
        return prevCartData.map(cart => {
          if (cart.uids === idSeller) {
            return ({ ...cart, products: newProducts })
          }
          return cart
        })
      })

      await editQty({
        email: auth.currentUser.email,
        qty,
        idCart: productToChange.idCart,
        uids: productToChange.uids,
      })

    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    let email = userInfo.email;
    let milisecond = 1100;

    if (!userInfo.email) {
      email = auth.currentUser.email
      milisecond = 1300
    }

    setTimeout(async () => {
      try {
        await fetchCartData({
          email,
          setCartsData,
          setCheckedAll,
          setProductsReadyToCheckout,
          setLoading,
        })
      } catch (error) {
        setLoading(false)
        console.log(error.message);
      }
    }, milisecond)
  }, [userInfo?.email])

  const toggleCheckWrapper = async (idCart, idSeller) => {
    try {
      await toggleCheck({
        cartsData,
        setCartsData,
        setCheckedAll,
        setProductsReadyToCheckout,
        idCart,
        idSeller
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const toggleAllCheckWrapper = async () => {
    try {
      await toggleCheckAll({ setCartsData, setCheckedAll, setProductsReadyToCheckout })
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleBuy = () => {
    if (productsReadyToCheckout.totalproducts === 0) return;

    navigate('/payment')

    window.sessionStorage.setItem('products', JSON.stringify(productsReadyToCheckout))
  }

  if (loading) return <Loading />
  else return (
    <>
      <header>
        {windowWidth < 1024 ? (
          <NavbarTop2>
            Keranjang saya
            <span className='font-normal text-slate-800 text-base'> ({productsReadyToCheckout.totalproducts})</span>
          </NavbarTop2>
        ) : <NavbarTop widthInputSearch={false} />}
        {windowWidth < 1024 && cartsData.length !== 0 && <NavBottomCartPage productsReadyToCheckout={productsReadyToCheckout} checkAll={checkedAll} toggleCheckAll={toggleAllCheckWrapper} onClick={handleBuy} />}
      </header>
      <main className="bg-neutral-100/60 w-full min-h-screen padding-inline pt-16 sm:pt-20 lg:pt-24 pb-20">

        {windowWidth >= 1024 && (
          <span className="block mb-3 px-3 py-1 w-max">
            <h1 className="font-bold text-slate-900 text-2xl mb-4">keranjang saya</h1>
            {cartsData.length !== 0 && (
              <CheckboxProduct id='allProduct' label='pilih semua' ariaLabel='pilih semua produk' checked={checkedAll} toggleCheck={toggleAllCheckWrapper} />
            )}
          </span>
        )}

        <div className={`w-full min-h-max gap-4 ${cartsData.length !== 0 && 'lg:flex'}`}>
          <section className="flex flex-col gap-5 basis-2/3">
            {cartsData.length !== 0 ? (
              <CartsCard
                cartsData={cartsData}
                setCartsData={setCartsData}
                toggleCheckWrapper={toggleCheckWrapper}
                handleClickBtnQty={handleClickBtnQty}
                setProductsReadyToCheckout={setProductsReadyToCheckout}
              />
            ) : (
              <div className="px-12 grid place-content-center w-full min-h-[50vh] *:text-center">
                <article className="flex flex-col gap-8 bg-white rounded-xl drop-shadow-sm px-9 py-5 lg:p-8">
                  <h1 className="text-2xl font-bold text-slate-800">Oops! Keranjang Belanja Kosong</h1>
                  <Link to="/" className="group flex gap-2 justify-center bg-slate-50 border hover:shadow-sm hover:bg-slate-100 font-semibold text-slate-800 py-1.5 px-3 rounded-lg transition">
                    <img className="group-hover:-translate-x-1 transition-transform duration-300" src={LeftIcon} alt="left icon" width={24} height={24} />
                    Mulai Belanja
                  </Link>

                </article>
              </div>
            )}
          </section>

          {windowWidth >= 1024 && cartsData.length !== 0 && (
            <section className="sticky top-20 shadow-sm bg-white grid grid-cols-2 h-max p-3 rounded-lg border basis-1/3">
              <h1 className="col-span-full mb-4 font-semibold text-lg">detail pesanan</h1>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-600">Total harga</span>
                <span className="font-semibold text-slate-600">ongkir</span>
                <span className="font-semibold text-slate-600">Diskon</span>
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-slate-900">{formattedIDR(productsReadyToCheckout?.totalPrice)}</span>
                <span className="font-semibold text-slate-900">{productsReadyToCheckout?.totalPrice ? formattedIDR(17000) : formattedIDR(0)}</span>
                <span className="font-semibold text-slate-900">-{productsReadyToCheckout?.totalPrice ? formattedIDR(12000) : formattedIDR(0)}</span>
              </div>

              <div className="col-span-full grid grid-cols-2 border-t mt-3 pt-3">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{productsReadyToCheckout?.totalproducts !== 0 ? formattedIDR((productsReadyToCheckout?.totalPrice + 17000) - 12000) : formattedIDR(0)}</span>
                <button
                  type="button"
                  aria-label="beli sekarang"
                  disabled={productsReadyToCheckout.products.length === 0}
                  title={productsReadyToCheckout?.totalPrice ? 'beli sekarang' : ''}
                  onClick={handleBuy}
                  className="col-span-full bg-green-500 active:bg-green-500 hover:bg-green-600 focus:bg-green-600 disabled:bg-green-500 disabled:hover:bg-green-500 disabled:focus:bg-green-500 mt-3 py-1 rounded text-white">
                  Beli ({productsReadyToCheckout?.totalproducts})
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}

export default CartProductPage