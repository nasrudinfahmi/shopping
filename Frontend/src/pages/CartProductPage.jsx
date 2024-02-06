import NavBottomCartPage from "../components/fragments/navbar/NavbarBottom/NavBottomCartPage"
import NavTopCartPage from "../components/fragments/navbar/NavbarTop/NavTopCartPage"
import { useResizeWindow } from "../hooks"
import BtnQuantity from "../components/fragments/btnQuantity/BtnQuantity"
import { DATA_DUMMY_CARTS } from '../utils/constants'
import { useState } from "react"
import { formattedIDR } from "../utils/utils"
import CheckboxProduct from "../components/elements/CheckboxProduct"
import NavbarTop from '../components/fragments/navbar/NavbarTop/NavbarTop'
import { useSearchParams } from "react-router-dom"
import TitleSect from "../components/elements/TitleSect"
import CardProduct from "../components/fragments/card/CardProduct"
import ManFashion from '../assets/categories/man-fashion.webp'


function CartProductPage() {
  const { windowWidth } = useResizeWindow()
  const userId = 'userId123'
  const [cartDataDummy, setCartDataDummy] = useState(DATA_DUMMY_CARTS)

  const handleInputQty = (e) => {
    const inputText = e.target.textContent;
    const numericValue = Number(inputText.replace(/[^\d]/g, ''));
    const regex = /^\d*$/;

    // Handle case when input contains non-numeric characters
    if (!regex.test(inputText)) {
      e.target.textContent = numericValue
    }

    // handle case when input is greater than 50
    if (numericValue > 50) {
      e.target.textContent = inputText.slice(0, -1)
    }

    // Handle case when input starts with 0
    if (numericValue == 0) {
      e.target.textContent = '';
    }
  }

  const handleOnBlurQty = (e, idSeller) => {
    const inputText = e.target.textContent;
    const numericValue = Number(inputText.replace(/[^\d]/g, ''));
    const dataProduct = cartDataDummy[userId].carts.find(data => data.idSeller === idSeller)
    const idProduct = e.target.id
    const product = dataProduct.products.find(product => product.idProduct === idProduct)

    if (!numericValue) {
      e.target.textContent = product.qty
      return product.qty
    }

    e.target.textContent = numericValue
    setCartDataDummy(prevCartData => {
      let updatedCarts = { ...prevCartData }
      updatedCarts[userId].carts = updatedCarts[userId].carts.map(cart => {
        if (cart.idSeller === idSeller) {
          cart.products.map(product => {
            if (product.idProduct === idProduct) {
              const price = product.price * numericValue
              product.qty = numericValue
              product.totalPrice = price
            }
          })
        }
        return cart
      })
      return updatedCarts
    })

    return product.qty = numericValue
  }

  const handleClickBtnQty = (action, idSeller, idProduct) => {
    setCartDataDummy(prevCartData => {
      const updatedCarts = {
        ...prevCartData,
        [userId]: {
          ...prevCartData[userId],
          carts: prevCartData[userId].carts.map(cart => {
            if (cart.idSeller === idSeller) {
              return {
                ...cart,
                products: cart.products.map(product => {
                  if (product.idProduct === idProduct) {
                    const quantity = action === 'inc' ? Math.min(product.qty + 1, 50) : Math.max(product.qty - 1, 1);
                    const totalPrice = product.price * quantity;

                    return {
                      ...product,
                      qty: quantity,
                      totalPrice: totalPrice,
                    };
                  }
                  return product;
                }),
              };
            }
            return cart;
          }),
        },
      };

      return updatedCarts;
    });
  };

  const checkIsProductChekedAll = () => {
    const { carts } = cartDataDummy[userId]

    const totalChecked = carts.map(cart => {
      return cart.products.map(product => product.isChecked)
    }).flat()

    if (totalChecked.includes(false)) return false
    return true
  }

  const [checkAll, setCheckAll] = useState(() => checkIsProductChekedAll())

  const toggleCheck = (idProduct, idSeller) => {
    setCartDataDummy(prevcarts => {
      let updatedCarts = { ...prevcarts };
      updatedCarts[userId].carts = updatedCarts[userId].carts.map(cart => {
        if (cart.idSeller === idSeller) {
          cart.products.map(product => {
            if (product.idProduct === idProduct) {
              return { ...product, isChecked: !product.isChecked }
            }
            return product
          })
        }
        return cart
      })
      return updatedCarts;
    });
    const isCheckedAll = checkIsProductChekedAll()
    setCheckAll(isCheckedAll)
  }

  const toggleCheckAll = () => {
    setCheckAll(!checkAll)
    onCheckAll()
  }

  const onCheckAll = () => {
    setCartDataDummy(prevcarts => {
      const updatedCarts = { ...prevcarts };
      updatedCarts[userId].carts = updatedCarts[userId].carts.map(cart => ({
        ...cart,
        products: cart.products.map(product => ({ ...product, isChecked: !checkAll })),
      }));
      return updatedCarts;
    });
  }

  const carts = cartDataDummy[userId].carts.map(dataCart => {
    const totalPriceProducts = dataCart.products.map(product => {
      if (product.isChecked) return product.totalPrice
      return null
    }).filter(cart => cart)
    return totalPriceProducts
  })

  const productReadyToCheckout = carts.reduce((cart, i) => {
    const totalProduct = cart.length + i.length
    return totalProduct
  })

  const totalPrice = carts.flat().reduce((price, i) => price + i, 0)

  const [searchParams] = useSearchParams()
  return (
    <>
      <header>
        {windowWidth < 1024 ? <NavTopCartPage /> : <NavbarTop />}
        {windowWidth < 1024 && <NavBottomCartPage cartDataDummy={cartDataDummy} checkAll={checkAll} toggleCheckAll={toggleCheckAll} />}
      </header>
      <main className="bg-neutral-100/60 w-full min-h-screen padding-inline pt-16 sm:pt-20 lg:pt-24 pb-20">
        {searchParams.get('product') && (
          <section className='mt-8 lg:mt-10 border-t-sect'>
            <TitleSect>{searchParams.get('product')}</TitleSect>
            <div className='mt-4 grid gap-2 sm:gap-3 lg:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 min-[1100px]:grid-cols-5 2xl:grid-cols-6'>
              {Array.from({ length: 10 }).map((_, index) => (
                <CardProduct
                  key={index}
                  href=''
                  src={ManFashion}
                  title='Baju bagus sekali'
                  summary='lorem ipsum dolor sit amet. lorem ipsum dolor sit amet'
                  price='Rp. 900.000'
                  store='Tokoku'
                />
              ))}
            </div>
          </section>
        )}
        {windowWidth >= 1024 && (
          <span className="block mb-3 px-3 py-1 w-max">
            <h1 className="font-bold text-slate-900 text-2xl mb-4">keranjang saya</h1>
            <CheckboxProduct id='allProduct' label='pilih semua' ariaLabel='pilih semua produk' checked={checkAll} toggleCheck={toggleCheckAll} />
          </span>
        )}

        <div className="w-full min-h-max lg:flex gap-4">
          <section className="flex flex-col gap-5 basis-2/3">
            {cartDataDummy[userId].carts.map(data => (
              <article key={data.idSeller} className="*:leading-none border p-3 rounded-lg bg-white">
                <h2 className="text-slate-800 text-lg line-clamp-1 border-b pb-2"><strong>{data.sellerName}</strong></h2>
                {data.products.map(product => (
                  <div key={product.idProduct} className="flex gap-2 py-[22px]">
                    <div className="shrink-0 flex items-start gap-2">
                      <CheckboxProduct id={`check-${product.idProduct}`} ariaLabel={`pilih produk ${product.productName}`} checked={product.isChecked} toggleCheck={() => {
                        product.isChecked = !product.isChecked
                        toggleCheck(product.idProduct, data.idSeller)
                      }} />
                      <img src={product.imgThumb} alt="gambar produk" width={80} height={80} className="aspect-square object-cover object-center rounded-md" />
                    </div>

                    <div className="basis-full">
                      <h3 className="leading-tight md:text-lg font-semibold text-slate-900 line-clamp-2">{product.productName}</h3>
                      <span className="block text-sm mt-1">{product.variasi}</span>
                      <h3 className="block mb-3 mt-2 pl-1">{formattedIDR(product.totalPrice)}</h3>
                      <BtnQuantity
                        handleClickBtnQty={handleClickBtnQty}
                        handleInputQty={handleInputQty}
                        handleOnBlurQty={handleOnBlurQty}
                        idSeller={data.idSeller}
                        product={product} />
                    </div>
                  </div>
                ))}
              </article>
            ))}
          </section>

          {windowWidth >= 1024 && (
            <section className="sticky top-20 shadow-sm bg-white grid grid-cols-2 h-max p-3 rounded-lg border basis-1/3">
              <h1 className="col-span-full mb-4 font-semibold text-lg">detail pesanan</h1>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-600">Total harga ({productReadyToCheckout})</span>
                <span className="font-semibold text-slate-600">ongkir</span>
                <span className="font-semibold text-slate-600">Diskon</span>
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-slate-900">{formattedIDR(totalPrice)}</span>
                <span className="font-semibold text-slate-900">{productReadyToCheckout ? formattedIDR(17000) : formattedIDR(0)}</span>
                <span className="font-semibold text-slate-900">-{productReadyToCheckout ? formattedIDR(12000) : formattedIDR(0)}</span>
              </div>

              <div className="col-span-full grid grid-cols-2 border-t mt-3 pt-3">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{productReadyToCheckout ? formattedIDR((totalPrice + 17000) - 12000) : formattedIDR(0)}</span>
                <button
                  type="button"
                  aria-label="beli sekarang"
                  disabled={productReadyToCheckout === 0}
                  title={productReadyToCheckout ? 'beli sekarang' : ''}
                  className="col-span-full bg-green-500 active:bg-green-500 hover:bg-green-600 focus:bg-green-600 disabled:bg-green-500 disabled:hover:bg-green-500 disabled:focus:bg-green-500 mt-3 py-1 rounded text-white">
                  Beli ({productReadyToCheckout})
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