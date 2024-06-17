import PropTypes from 'prop-types'
import MinusIcon from '../../../assets/icons/minus.svg'
import PlusIcon from '../../../assets/icons/plus.svg'
import TrashIcon from '../../../assets/icons/trash.svg'
import { useEffect, useState } from 'react'
import { addToCart } from '../../../lib/firebase/services/cartFirebase'
import { auth } from '../../../lib/firebase/init'

function BtnQuantity({
  handleInputQty,
  handleOnBlurQty,
  handleClickBtnQty,
  product,
  idSeller,
  paddingBlock }) {

  const [qty, setQty] = useState(product.qty)

  const handleBtnQty = async (action) => {
    try {
      handleClickBtnQty(action, idSeller, product.idCart)
      const newQty = action === 'inc' ? Math.min(product.qty + 1, 50) : Math.max(product.qty - 1, 1)
      setQty(newQty)

      await addToCart({
        email: auth.currentUser.email,
        qty: action === 'inc' ? 1 : -1,
        storeName: product.storeName,
        uid: product.uid,
        uids: product.uids,
        variations: product.variations,
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleBlur = (e) => {
    const quantity = handleOnBlurQty(e, idSeller)
    setQty(quantity)
  }

  useEffect(() => {
    const qtyInputElement = document.getElementById(product.idCart)
    qtyInputElement.textContent = qty
  }, [product.idCart, qty])

  return (
    <span className="w-max flex border rounded-lg overflow-hidden">
      {qty === 1 ? (
        <button type="button" aria-label="hapus produk" className="border-none px-2 py-[2px]">
          <img src={TrashIcon} alt="ikon hapus" width={19} height={19} hidden={qty !== 1} />
        </button>
      ) : (
        <button type="button" aria-label="kurangi kuantiti" className="border-none px-2 py-[2px]" onClick={() => handleBtnQty('dec')}>
          <img src={MinusIcon} alt="Minus ikon" width={19} height={19} />
        </button>
      )}
      <div
        contentEditable
        onInput={handleInputQty}
        onBlur={e => handleBlur(e)}
        inputMode='numeric'
        pattern="[0-9]*"
        id={product.idCart}
        className={`w-10 px-3 grid place-content-center border-x ${paddingBlock}`}
      />
      <button type="button" aria-label="Tambah kuantiti" disabled={qty >= 50} className="border-none px-2 py-[2px]" onClick={() => handleBtnQty('inc')}>
        <img src={PlusIcon} alt="Plus ikon" width={19} height={19} />
      </button>
    </span>
  )
}

BtnQuantity.propTypes = {
  handleInputQty: PropTypes.func.isRequired,
  handleOnBlurQty: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  idSeller: PropTypes.string.isRequired,
  handleClickBtnQty: PropTypes.func.isRequired,
  paddingBlock: PropTypes.string,
}

export default BtnQuantity
