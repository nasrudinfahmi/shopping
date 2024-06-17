import PropTypes from 'prop-types'
import TitleSect from '../../elements/TitleSect'
import { formattedIDR } from '../../../utils/utils'

function DetailSect({ product }) {
  return (
    <section className="md:basis-1/2 p-1 pt-3 mt-6 md:mt-0 bg-white rounded-md sm:p-4 lg:p-7 lg:rounded-lg">
      <TitleSect>Detail produk</TitleSect>
      <section className="grid grid-cols-3 mt-2 pt-2 pb-1 border-t">
        <div className="col-span-1 flex flex-col gap-1 *:line-clamp-1">
          <span>Produk</span>
          <span>Merek</span>
          <span>Harga</span>
          <span>Status</span>
          {product.status === 'ready' && <span>Stok</span>}
          <span>Pengiriman</span>
        </div>
        <div className="col-span-2 flex flex-col gap-1 *:line-clamp-1">
          <span>{product.productName}</span>
          <span>{product.brand}</span>
          <span>{formattedIDR(product.price)}</span>
          <span>{product.status}</span>
          {product.status === 'ready' && <span>{product.qty}</span>}
          <span>{product.delivery}</span>
        </div>
      </section>
    </section>
  )
}

DetailSect.propTypes = {
  product: PropTypes.object.isRequired,
}

export default DetailSect