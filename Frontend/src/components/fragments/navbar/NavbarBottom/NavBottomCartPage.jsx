import PropTypes from 'prop-types'
import CheckboxProduct from '../../../elements/CheckboxProduct'
import { formattedIDR } from '../../../../utils/utils'

function NavBottomCartPage({ productsReadyToCheckout, checkAll, toggleCheckAll, onClick }) {
  return (
    <nav className="z-[99999] fixed w-full pt-3 pb-4 px-3 sm:px-5 md:px-6 bottom-0 left-0 shadow-navbottom border-t border-t-slate-200/40 bg-white rounded-t-xl">
      <div className="flex justify-between gap-3 px-1">
        <CheckboxProduct id='allProduct' label='semua' ariaLabel='pilih semua produk' checked={checkAll} toggleCheck={toggleCheckAll} />

        <div className="flex gap-3">
          <div className="h-full w-max grid place-content-center gap-1 *:text-sm *:leading-none">
            <p className='text-right'>Total</p>
            <p>{formattedIDR(productsReadyToCheckout.totalPrice)}</p>
          </div>
          <button type="button" onClick={onClick} aria-label="bayar produk" className="bg-green-500 text-white py-2 px-3 rounded-md">
            beli ({productsReadyToCheckout.totalproducts})
          </button>
        </div>
      </div>

    </nav>
  )
}

NavBottomCartPage.propTypes = {
  productsReadyToCheckout: PropTypes.object.isRequired,
  checkAll: PropTypes.bool.isRequired,
  toggleCheckAll: PropTypes.func,
  onClick: PropTypes.func.isRequired,
}

export default NavBottomCartPage