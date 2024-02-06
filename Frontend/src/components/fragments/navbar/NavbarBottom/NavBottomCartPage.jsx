import PropTypes from 'prop-types'
import CheckboxProduct from '../../../elements/CheckboxProduct'
import { formattedIDR } from '../../../../utils/utils'
// import { useState } from 'react'

function NavBottomCartPage({ cartDataDummy, checkAll, toggleCheckAll }) {
  const userId = 'userId123'

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

  return (
    <nav className="z-[99999] fixed w-full pt-3 pb-4 px-2 bottom-0 left-0 shadow-navbottom border-t border-t-slate-200/40 bg-white rounded-t-xl">
      <div className="flex justify-between gap-3 px-1">
        <CheckboxProduct id='allProduct' label='semua' ariaLabel='pilih semua produk' checked={checkAll} toggleCheck={toggleCheckAll} />

        <div className="flex gap-3">
          <div className="h-full w-max grid place-content-center gap-1 *:text-sm *:leading-none">
            <p className='text-right'>Total</p>
            <p>{formattedIDR(totalPrice)}</p>
          </div>
          <button type="button" aria-label="bayar produk" className="bg-green-500 text-white py-2 px-3 rounded-md">
            beli ({productReadyToCheckout})
          </button>
        </div>
      </div>

    </nav>
  )
}

NavBottomCartPage.propTypes = {
  cartDataDummy: PropTypes.object.isRequired,
  checkAll: PropTypes.bool.isRequired,
  toggleCheckAll: PropTypes.func
}

export default NavBottomCartPage