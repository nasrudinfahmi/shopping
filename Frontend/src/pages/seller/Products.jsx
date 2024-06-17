import PreviewIcon from '../../assets/icons/eye.svg'
import EditIcon from '../../assets/icons/edit.svg'
import DeleteIcon from '../../assets/icons/trash.svg'
import { Link } from 'react-router-dom'
import PlusIcon from '../../assets/icons/plus.svg'
import { useScrollWindow, useSeller } from '../../hooks'
import { deleteProduct, getAllSellersProducts } from '../../lib/firebase/services/productFirebase'
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Toast, confirmDeleteCartsProduct } from '../../lib/sweetalert2/init'

function Products() {
  const { seller } = useSeller()
  const { scrollY } = useScrollWindow()

  const [allProducts, setAllProducts] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(true)

  const handleDelete = async (uid) => {
    try {
      const { isConfirmed } = await Swal.fire(confirmDeleteCartsProduct)
      if (!isConfirmed) return;

      const product = allProducts.find(product => product.uid === uid)
      const imgs = [...product.imgs, product.thumbProduct]

      await deleteProduct(uid, imgs)
      const products = allProducts.filter(product => product.uid !== uid)

      setAllProducts(products)
      setSearchResult(products)

      Toast.fire({
        icon: 'success',
        title: 'Produk Berhasil dihapus!',
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const fetchGetProducts = useCallback(async () => {
    try {
      if (!seller?.uids) throw new Error('Data tidak valid!')
      const productsResponse = await getAllSellersProducts(seller?.uids)

      return productsResponse.data
    } catch (error) {
      console.log(error.message)
      if (error.message === 'Produk tidak ditemukan.') {
        return []
      }
    }
  }, [seller?.uids])

  useEffect(() => {
    setTimeout(async () => {
      const products = await fetchGetProducts()
      setAllProducts(products)
      setSearchResult(products)
      setLoading(false)
    }, 1000)
  }, [fetchGetProducts])

  const handleSearch = (e) => {
    const keyword = e.target.value?.trim() || '';
    const products = [...allProducts]

    if (!keyword) {
      setSearchResult(allProducts)
      return e.target.value = ''
    }

    e.target.value = e.target.value.toUpperCase()

    const searchValue = products
      .filter(product => product.productName.toLowerCase().includes(keyword.toLowerCase()))

    setSearchResult(searchValue)

    if (!keyword && searchValue.length == 0) setSearchResult(allProducts)
  }

  return (
    <>
      <div className='flex items-center justify-between px-2'>
        <h1 className='w-max text-3xl font-semibold text-slate-900'>Produk Saya</h1>
        <Link to="/dashboard/new-product" title='Tambah Produk Baru' aria-label='Tambah Produk Baru' className='inline-block px-4 py-1.5 rounded-md drop-shadow-sm hover:drop-shadow bg-white hover:bg-white/90 duration-150'>Produk Baru</Link>
      </div>

      {scrollY > 80 && (
        <Link to="/dashboard/new-product" title='Tambah Produk Baru' aria-label='Tambah Produk Baru' className='block z-50 fixed right-6 lg:right-10 bottom-12 rounded-full p-1 drop-shadow hover:drop-shadow-md bg-teal-100 hover:bg-teal-200 duration-150'>
          <img src={PlusIcon} alt="ikon plus" width={36} height={36} className='sm:size-10' />
        </Link>
      )}

      <section className="w-full flex flex-col gap-20 py-6 min-h-screen mt-7 rounded-2xl drop-shadow-sm bg-white">
        <section className="px-2 sm:px-5">
          <h1 className='w-max translate-x-1 text-2xl font-semibold text-slate-900'>Top Produk</h1>
          <div className="w-full overflow-x-auto mt-5 rounded-md overflow-hidden">
            <table className="w-full table-auto rounded-md overflow-hidden" align="center">
              <thead>
                <tr className="*:px-4 h-14 sm:h-16 bg-slate-100/65 *:text-slate-600 xl:*:text-lg">
                  <th>PRODUK</th>
                  <th>MEREK</th>
                  <th>HARGA</th>
                  <th>TERJUAL</th>
                  <th>PENDAPATAN</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="*:px-4 *:py-5 *:text-center *:leading-tight *:text-slate-800 xl:*:text-lg">
                    <td className='*:line-clamp-2'>
                      <div>Sepatu adidas</div>
                    </td>
                    <td className='*:line-clamp-2'>
                      <div>Sepatu pria</div>
                    </td>
                    <td className='*:line-clamp-2'>
                      <div>4000000</div>
                    </td>
                    <td className='*:line-clamp-2'>
                      <div>3</div>
                    </td>
                    <td className='*:line-clamp-2'>
                      <div>12000000</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="px-2 sm:px-5">
          <div className='w-full flex items-start flex-col gap-4 sm:flex-row sm:items-center sm:gap-0 justify-between'>
            <h1 className='w-max translate-x-1 text-2xl font-semibold text-slate-900'>Semua Produk</h1>
            <input
              type="search"
              onChange={handleSearch}
              aria-label='Cari Produk Saya'
              title='Cari Produk Saya'
              autoComplete='off'
              spellCheck={false}
              name="searchOwnProduct"
              id="searchOwnProduct"
              placeholder='Cari Produk Saya...'
              className='outline-none w-full sm:w-1/2 md:w-2/5 px-0.5 py-1.5 focus:border-b font-medium text-lg text-slate-500'
            />
          </div>
          <div className="w-full overflow-x-auto mt-5 rounded-md overflow-hidden">
            <table className="w-full table-auto rounded-md overflow-hidden" align="center">
              <thead>
                <tr className="h-14 sm:h-16 bg-slate-100/65 *:text-slate-600 xl:*:text-lg">
                  <th className='px-4'>PRODUK</th>
                  <th className='px-4'>MEREK</th>
                  <th className='px-4'>HARGA</th>
                  <th className='px-4'>STOK</th>
                  <th className='px-7'>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {!loading && searchResult.map((product, index) => (
                  <tr key={index} className="*:px-4 *:py-5 *:text-center *:leading-tight *:text-slate-800 xl:*:text-lg">
                    <td className='*:line-clamp-2'>
                      <div>{product.productName}</div>
                    </td>
                    <td className='*:line-clamp-2'>
                      <div>{product.brand}</div>
                    </td>
                    <td className='*:line-clamp-2'>
                      <div>{product.price}</div>
                    </td>
                    <td className='*:line-clamp-2'>
                      <div>{product.qty}</div>
                    </td>
                    <td>
                      <div className='flex items-center justify-center gap-4 sm:gap-5'>
                        <Link to={`/product/${product.uid}?preview=true`} type="button" className='md:size-7 grid place-content-center rounded-full hover:bg-slate-100 duration-150' aria-label='preview produk' title='Preview Produk'>
                          <img src={PreviewIcon} alt="ikon preview" width={24} height={24} />
                        </Link>
                        <Link to={`/dashboard/product/edit?uid=${product.uid}`} type="button" className='md:size-7 grid place-content-center rounded-full hover:bg-green-100 duration-150' aria-label='edit produk' title='Edit Produk'>
                          <img src={EditIcon} alt="ikon Edit" width={24} height={24} />
                        </Link>
                        <button type="button" onClick={() => handleDelete(product.uid)} className='md:size-7 grid place-content-center rounded-full hover:bg-red-100 duration-150' aria-label='hapus produk' title='Hapus Produk'>
                          <img src={DeleteIcon} alt="ikon hapus" width={24} height={24} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </section>
      </section>
    </>
  )
}

export default Products