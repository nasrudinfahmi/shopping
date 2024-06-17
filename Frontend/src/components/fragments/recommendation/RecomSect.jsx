import { useCallback, useEffect, useState } from 'react'
import ManFashion from '../../../assets/categories/man-fashion.webp'
import TitleSect from '../../elements/TitleSect'
import CardProduct from '../card/CardProduct'
import { getProducts } from '../../../lib/firebase/services/productFirebase'

function RecomSect() {
  const [recomProducts, setRecomProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      const products = await getProducts()

      return products.data
    } catch (error) {
      throw new Error(error)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
      .then(async product => {
        setRecomProducts(product)
        setLoading(false)
      })
      .catch(error => console.log(error))
  }, [fetchProducts])

  return (
    <section className='mt-8 lg:mt-10 border-t-sect'>
      <TitleSect>Top Produk Bulan Ini</TitleSect>
      <div className='mt-4 grid gap-2 sm:gap-3 lg:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 min-[1100px]:grid-cols-5 2xl:grid-cols-6'>
        {!loading && recomProducts.map((product, index) => (
          <CardProduct
            key={index}
            href={`/product/${product.id}`}
            src={product.thumbProduct}
            title={product.productName}
            summary={product.summary ? product.summary : product.description ? product.description : ''}
            price={String(product.price)}
            store={product.uids}
          />
        ))}
        {loading && Array.from({ length: 10 }).map((_, index) => (
          <CardProduct
            key={index}
            href=''
            src={ManFashion}
            title=''
            summary=''
            price=''
            store=''
          />
        ))}
      </div>
    </section>
  )
}

export default RecomSect
