import PageLayout from "../components/layouts/PageLayout"
import { useCallback, useEffect, useState } from "react"
import DescriptionSect from '../components/fragments/sections/DescriptionSect'
import HeroSectDetailProduct from "../components/fragments/heroSect/HeroSectDetailProduct"
import DetailSect from "../components/fragments/sections/DetailSect"
import { getProduct } from "../lib/firebase/services/productFirebase"
import { useParams } from "react-router-dom"
import Loading from "../components/elements/Loading"

function DetailProductPage() {
  const { idProduct } = useParams()
  const [product, setProduct] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchProduct = useCallback(async () => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    try {
      if (!idProduct) throw new Error('Produk tidak ditemukan!')
      const productResponse = await getProduct(idProduct)

      return productResponse.data
    } catch (error) {
      console.log(error)
    }
  }, [idProduct])

  useEffect(() => {
    setTimeout(async () => {
      const product = await fetchProduct()

      setProduct(product)
      setLoading(false)
    }, 1300)
  }, [fetchProduct])

  return (
    <PageLayout>
      {loading && <Loading />}
      {!loading && (
        <>
          <HeroSectDetailProduct idProduct={idProduct} product={product} />
          <section className="mt-6 md:flex gap-4 items-start">
            <DescriptionSect product={product} />
            <DetailSect product={product} />
          </section>
        </>
      )}
    </PageLayout>
  )
}

export default DetailProductPage