import PropTypes from 'prop-types'
import ChatIcon from '../../../../assets/icons/chat.svg'

function NavBottomDetailPage({ handleAddToCart, handleBuy }) {
  return (
    <nav className="z-[99999] fixed w-full pt-3 pb-4 px-2 bottom-0 left-0 shadow-navbottom border-t border-t-slate-200/40 bg-white rounded-t-xl">
      <div className="flex justify-around gap-3 px-1">
        <button type="button" className="flex w-max border shadow-sm rounded-md px-2 py-1">
          <img src={ChatIcon} alt="ikon pesan" width={24} height={24} className='m-auto' />
        </button>
        <span className="basis-full flex justify-around gap-3">
          <button onClick={handleBuy} className="bg-white basis-1/2 text-center font-semibold shadow-sm rounded-md px-2 py-1 border border-green-600 text-green-600" type="button" aria-label='Beli'>Beli</button>
          <button onClick={handleAddToCart} className="bg-green-500 basis-1/2 text-white font-semibold shadow-sm text-center border-green-600 rounded-md px-2 py-1" type="button" aria-label='Masukkan keranjang'><span className="text-lg">+</span> Keranjang</button>
        </span>
      </div>
    </nav>
  )
}

NavBottomDetailPage.propTypes = {
  handleAddToCart: PropTypes.func.isRequired,
  handleBuy: PropTypes.func.isRequired,
}

export default NavBottomDetailPage