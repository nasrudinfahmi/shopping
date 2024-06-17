import PropTypes from 'prop-types'
import CheckboxProduct from '../../elements/CheckboxProduct'
import LabelVariations from '../../elements/LabelVariations'
import InputQty from '../../elements/InputQty'
import { formattedIDR } from '../../../utils/utils'

function CartsCard({
  cartsData,
  setCartsData,
  toggleCheckWrapper,
  handleClickBtnQty,
  setProductsReadyToCheckout }) {
  return (
    <>
      {cartsData.map((data, index) => (
        <article key={index} className="*:leading-none border p-3 rounded-lg bg-white">
          <h2 className="text-slate-800 text-lg line-clamp-1 border-b pb-2"><strong>{data.storeName}</strong></h2>
          {data.products.map(product => (
            <div key={product.idCart} className="flex gap-2 py-[22px]">
              <div className="shrink-0 flex items-start gap-2">
                <CheckboxProduct product={product} id={`check-${product.idCart}`} ariaLabel={`pilih produk ${product.productName}`} checked={product.isReady} toggleCheck={() => {
                  product.isReady = !product.isReady
                  toggleCheckWrapper(product.idCart, product.uids)
                }} />
                <img src={product.imgThumb} alt="gambar produk" width={80} height={80} className="aspect-square object-cover object-center rounded-md" />
              </div>

              <div className="basis-full">
                <h3 className="leading-tight md:text-lg font-semibold text-slate-900 line-clamp-2">{product.productName}</h3>
                <LabelVariations variations={product.variations} />
                <h3 className="block mb-3 mt-2 pl-1">{formattedIDR(product.price * product.qty)}</h3>
                <InputQty cartsData={cartsData} setProductsReadyToCheckout={setProductsReadyToCheckout} product={product} idSeller={product.uids} handleClickBtnQty={handleClickBtnQty} setCartsData={setCartsData} />
              </div>
            </div>
          ))}
        </article>
      ))}
    </>
  )
}

CartsCard.propTypes = {
  cartsData: PropTypes.array.isRequired,
  setCartsData: PropTypes.func.isRequired,
  toggleCheckWrapper: PropTypes.func.isRequired,
  handleClickBtnQty: PropTypes.func.isRequired,
  setProductsReadyToCheckout: PropTypes.func.isRequired,
}

export default CartsCard
