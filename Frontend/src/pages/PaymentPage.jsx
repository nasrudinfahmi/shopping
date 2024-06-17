import PropTypes from 'prop-types'
import { useMemo } from "react"
import NavbarTop2 from "../components/fragments/navbar/NavbarTop/NavbarTop2"
import { formattedIDR } from "../utils/utils"
import LabelVariations from "../components/elements/LabelVariations"
import { useResizeWindow, useUser } from "../hooks"
import { Navigate, useNavigate } from 'react-router-dom'
import { auth } from '../lib/firebase/init'
import { deleteManyProductsCart } from '../lib/firebase/services/cartFirebase'
import { Toast } from '../lib/sweetalert2/init'

function PaymentPage() {
  const { windowWidth } = useResizeWindow()

  const productsReadyToCheckout = useMemo(() => {
    const productsReady = JSON.parse(window.sessionStorage.getItem('products'))
    return productsReady
  }, [])


  if (!productsReadyToCheckout) return Navigate({ to: '/cart' })
  return (
    <>
      <header>
        <NavbarTop2>
          Pembayaran
          <span className='font-normal text-slate-800 text-base'> ({productsReadyToCheckout.totalproducts})</span>
        </NavbarTop2>
      </header>

      <main className="bg-neutral-100/60 w-full min-h-screen padding-inline pt-16 sm:pt-20 lg:pt-24 pb-20">
        <div className={`w-full min-h-max gap-4 ${productsReadyToCheckout.totalproducts !== 0 && 'lg:flex'}`}>
          <section className="flex flex-col gap-5 basis-2/3">
            {productsReadyToCheckout.products.map((data, index) => (
              <article key={index} className="*:leading-none border p-3 rounded-lg bg-white">
                <h2 className="text-slate-800 text-lg line-clamp-1 border-b pb-2"><strong>{data.storeName}</strong></h2>
                {data.products.map((product, index) => (
                  <div key={index} className="flex gap-2 py-[22px]">
                    <div className="shrink-0 flex items-start gap-2">
                      <img src={product.imgThumb} alt="gambar produk" width={80} height={80} className="aspect-square object-cover object-center rounded-md" />
                    </div>

                    <div className="basis-full">
                      <h3 className="leading-tight md:text-lg font-semibold text-slate-900 line-clamp-2">{product.productName}</h3>
                      <LabelVariations variations={product.variations} />
                      <h3 className="block mb-3 mt-2 pl-1">{formattedIDR(product.price * product.qty)}</h3>
                      <h3 className="block mb-3 mt-2 pl-1">kuantiti {product.qty}</h3>
                    </div>
                  </div>
                ))}
              </article>
            ))}

            <div className='mt-7'>
              {windowWidth < 1024 && (
                <OrderSummary productsReadyToCheckout={productsReadyToCheckout} />
              )}
            </div>
          </section>

          {windowWidth >= 1024 && (
            <OrderSummary productsReadyToCheckout={productsReadyToCheckout} />
          )}
        </div>
      </main>
    </>
  )
}

function OrderSummary({ productsReadyToCheckout }) {
  const { userInfo } = useUser()
  const navigate = useNavigate()

  const handleBuy = async () => {
    try {
      const email = userInfo.email || auth.currentUser.email
      let products = []

      productsReadyToCheckout.products.forEach(data => {
        data.products.forEach(product => products.push(({
          uids: product.uids,
          idCart: product.idCart,
        })))
      })?.flat()

      await deleteManyProductsCart({ email, products })

      Toast.fire({
        icon: 'info',
        title: 'Loading ...',
        timer: 3100
      })

      setTimeout(() => {
        window.sessionStorage.removeItem('products')

        Toast.fire({
          icon: 'success',
          title: 'Pembayaran berhasil',
        })

        navigate(-1, { replace: true })
      }, 3100)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
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
          onClick={handleBuy}
          disabled={productsReadyToCheckout.products.length === 0}
          title={productsReadyToCheckout?.totalPrice ? 'beli sekarang' : ''}
          className="col-span-full bg-green-500 active:bg-green-500 hover:bg-green-600 focus:bg-green-600 disabled:bg-green-500 disabled:hover:bg-green-500 disabled:focus:bg-green-500 mt-3 py-1 rounded text-white">
          Bayar ({productsReadyToCheckout?.totalproducts})
        </button>
      </div>
    </section>
  )
}

OrderSummary.propTypes = {
  productsReadyToCheckout: PropTypes.object.isRequired,
}

export default PaymentPage