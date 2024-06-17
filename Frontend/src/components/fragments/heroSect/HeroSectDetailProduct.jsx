import PropTypes from 'prop-types'
import { useResizeWindow } from '../../../hooks'
import MinusIcon from '../../../assets/icons/minus.svg'
import PlusIcon from '../../../assets/icons/plus.svg'
import { useEffect, useMemo, useState } from 'react'
import { formattedIDR } from '../../../utils/utils'
import { useNavigate, useSearchParams } from 'react-router-dom'
import RadioBtn2 from '../../elements/RadioBtn2'
import { getSeller } from '../../../lib/firebase/services/sellerFirestore'
import { auth } from '../../../lib/firebase/init'
import { addToCart } from '../../../lib/firebase/services/cartFirebase'
import { calculateNewQty } from '../../../services/cartServices'
import { Toast } from '../../../lib/sweetalert2/init'
import Swal from 'sweetalert2'
import NavBottomDetailPage from '../navbar/NavbarBottom/NavBottomDetailPage'

function HeroSectDetailProduct({ product, idProduct }) {
  const { windowWidth } = useResizeWindow()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isPreview, setIsPreview] = useState()
  const [qty, setQty] = useState(1)
  const [imgActive, setImgActive] = useState(product.thumbProduct)
  const [tagsSelected, setTagsSelected] = useState(() => {
    if (product.tagVariations.length === 0) {
      return { variasi: 'default' }
    }

    return {}
  })

  const navigate = useNavigate()

  const imgs = useMemo(() => {
    if (product.imgs.length > 0) {
      return [product.thumbProduct, ...product.imgs]
    } else {
      return []
    }
  }, [product.imgs, product.thumbProduct])

  const handleClickBtnQty = (action) => {
    const newQty = calculateNewQty(action, qty)
    setQty(Number(newQty))
  }

  useEffect(() => {
    const preview = searchParams.get('preview')
    if (preview !== 'true') {
      setSearchParams({})
      setIsPreview(false)
    } else {
      setIsPreview(true)
    }
  }, [searchParams, setSearchParams])

  const handleChangeQty = (e) => {
    let value = e.target.value.replace(/^0+/, '')

    if (value < 0) value = 1
    if (value > 50) value = 50

    if (value === '') setQty('')
    else setQty(Number(value))
  }

  const handleBlurQty = (e) => {
    const value = Number(e.target.value.replace(/^0+/, ''))
    handleChangeQty(e)

    if (value === '' || value == 0) {
      e.target.value = 1
      setQty(1)
    }
  }

  const handlePreviewImg = () => {
    Swal.fire({
      imageUrl: imgActive,
      imageAlt: "Gambar produk",
      confirmButtonText: 'Tutup',
      confirmButtonAriaLabel: 'tutup modal dialog gambar',
      confirmButtonColor: 'rgb(16 185 129)',
    });
  }

  const handleBuy = async () => {
    try {
      let quantity = qty;
      const sellerResponse = await getSeller(product.uids)

      if (windowWidth < 640) {
        const { value, isConfirmed } = await Swal.fire({
          title: "Mau berapa pcs?",
          inputPlaceholder: "Maksimal 50 pcs",
          input: "number",
          inputValue: 1,
          confirmButtonText: 'Beli',
          showCancelButton: true,
          cancelButtonText: 'Batal',
          cancelButtonAriaLabel: "batal",
        });

        if (!isConfirmed) return;

        if (Number(value)) {
          if (Number(value) > 50) {
            return Toast.fire({
              icon: 'error',
              title: 'Maksimal 50 pcs!'
            })
          }

          quantity = Number(value)
        } else {
          return Toast.fire({
            icon: 'error',
            title: 'Masukkan kuantiti yang benar'
          })
        }
      }

      const totalproducts = 1
      const totalPrice = Number(product.price) * Number(qty)
      const products = [
        {
          uids: product.uids,
          storeName: sellerResponse.data.storeName,
          totalProducts: 1,
          products: [{ ...product, qty: quantity, variations: tagsSelected, imgThumb: product.thumbProduct }]
        }
      ]

      const datas = { totalproducts, totalPrice, products }
      const totalVariations = product.tagVariations.length

      if (totalVariations === 0) {
        sessionStorage.setItem('products', JSON.stringify(datas))
        return navigate('/payment')
      }

      if (Object.keys(tagsSelected).length === totalVariations) {
        sessionStorage.setItem('products', JSON.stringify(datas))
        return navigate('/payment')
      } else {
        return Toast.fire({
          icon: 'error',
          title: 'Pilih variasi produk terlebih dahulu'
        })
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleAddToCart = async () => {
    try {
      const sellerResponse = await getSeller(product.uids)
      const datas = {
        email: auth.currentUser.email,
        qty,
        uid: idProduct,
        uids: product.uids,
        storeName: sellerResponse.data.storeName,
        variations: tagsSelected
      }

      const totalVariations = product.tagVariations.length

      if (totalVariations > 0) {
        if (Object.keys(tagsSelected).length === totalVariations) {
          const cartResponse = await addToCart(datas)

          if (cartResponse.success) {
            Toast.fire({
              icon: 'success',
              title: 'Produk berhasil ditambahkan ke keranjang'
            })
          }
        } else {
          Toast.fire({
            icon: 'error',
            title: 'Pilih variasi produk terlebih dahulu'
          })
        }
      } else {
        const cartResponse = await addToCart(datas)

        if (cartResponse.success) {
          Toast.fire({
            icon: 'success',
            title: 'Produk berhasil ditambahkan ke keranjang'
          })
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
      {windowWidth < 640 && <NavBottomDetailPage handleAddToCart={handleAddToCart} handleBuy={handleBuy} />}
      <section className="bg-white min-h-max pb-6 rounded-md sm:flex gap-4 md:gap-8 lg:gap-12 xl:gap-16 sm:p-4 lg:p-7 lg:rounded-lg">
        <article className="sm:basis-1/2 lg:basis-2/5">
          <header>
            <img
              src={imgActive}
              alt="baju pria"
              width={500}
              height={500}
              onClick={handlePreviewImg}
              className="cursor-pointer w-full h-full aspect-video sm:aspect-[16/16] rounded-md object-cover object-center" />
          </header>
          <div className="grid mt-2 grid-cols-4 gap-2">
            {imgs.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="gambar produk"
                width={150}
                height={150}
                onClick={() => setImgActive(img)}
                className={`cursor-pointer w-full h-full rounded-md object-cover object-center border-2 ${img === imgActive ? 'border-green-300' : 'border-white'}`} />
            ))}
          </div>
        </article>
        <section className="*:leading-none px-1 sm:basis-1/2 lg:basis-3/5">
          {isPreview && <h1 className='text-3xl bg-orange-100 w-max p-1'>PREVIEW</h1>}
          <h1 className="text-xl lg:text-2xl mt-5 lg:mt-4">
            <strong>{product.productName}</strong>
          </h1>
          {product.summary && <p className="mt-3">{product.summary}</p>}

          <div className="mt-5 flex items-center gap-3 py-4 md:py-5">
            <h2 className="text-lg"><b>{formattedIDR(product.price)}</b></h2>
            <h2 className="text-sm"><s>{formattedIDR((product.price * (7 / 100)) + product.price)}</s></h2>
          </div>

          {product.tagVariations.length !== 0 && (
            <div className='mt-1 pt-4 pb-5 border-y flex flex-col gap-4'>
              {product.tagVariations.map((tag, index) => (
                <div key={index}>
                  <h2 className='text-lg font-semibold'>{tag.label}</h2>
                  <ul className="flex flex-wrap gap-2 mt-5">
                    {tag.tags.map((value, index) => (
                      <li key={index}>
                        <RadioBtn2 label={tag.label} id={value.id} value={value.text} setTagsSelected={setTagsSelected} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {windowWidth >= 640 && (
            <div>
              <span className="w-max flex border rounded-lg overflow-hidden mt-5">
                <button type="button" aria-label="kurangi kuantiti" className="border-none px-2" onClick={() => handleClickBtnQty("dec")}>
                  <img src={MinusIcon} alt="Minus ikon" width={24} height={24} />
                </button>
                <input
                  type="number"
                  value={qty}
                  minLength={1}
                  maxLength={50}
                  onChange={(handleChangeQty)}
                  onBlur={handleBlurQty}
                  id={`quantity-input-${product?.idCart}`}
                  aria-label='field kuantiti produk'
                  className="w-14 bg-gray-50 border-gray-300 h-6 sm:h-8 text-center text-gray-900 focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-x"
                  placeholder="1"
                  required />
                <button type="button" aria-label="Tambah kuantiti" className="border-none px-2" onClick={() => handleClickBtnQty("inc")}>
                  <img src={PlusIcon} alt="Plus ikon" width={24} height={24} />
                </button>
              </span>

              <span className="mt-5 flex gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  aria-label="masukkan keranjang"
                  title={`${isPreview ? 'preview' : 'Masukkan keranjang'}`}
                  disabled={isPreview}
                  className="block py-2 w-32 border rounded-lg disabled:bg-slate-200/70">
                  Keranjang
                </button>
                <button
                  onClick={handleBuy}
                  type="button"
                  aria-label="beli sekarang"
                  title={`${isPreview ? 'preview' : 'Beli langsung'}`}
                  disabled={isPreview}
                  className="block py-2 w-32 border rounded-lg disabled:bg-slate-200/70">
                  Beli
                </button>
              </span>
            </div>
          )}
        </section>
      </section>
    </>
  )
}

HeroSectDetailProduct.propTypes = {
  product: PropTypes.object.isRequired,
  idProduct: PropTypes.string.isRequired,
}

export default HeroSectDetailProduct
