import PropTypes from 'prop-types'
import { useResizeWindow } from '../../../hooks'
import ManFashion from '../../../assets/categories/man-fashion.webp'
import MinusIcon from '../../../assets/icons/minus.svg'
import PlusIcon from '../../../assets/icons/plus.svg'
import { useEffect } from 'react'
import RadioBtn from '../../elements/RadioBtn'

function HeroSectDetailProduct({
  handleInputQty,
  handleOnBlurQty,
  inputQtyRef,
  handleCheckedRadio,
  checkedRadioBtn,
  handleClickBtnQty,
  qty,
  setQty }) {
  const { windowWidth } = useResizeWindow()

  useEffect(() => {
    if (inputQtyRef.current || windowWidth >= 640) {
      inputQtyRef.current.textContent = qty
      if (!inputQtyRef.current.textContent) {
        inputQtyRef.current.textContent = 1
        setQty(1)
      }
    }
  }, [inputQtyRef, qty, setQty, windowWidth])

  return (
    <section className="bg-white min-h-screen pb-6 rounded-md sm:flex gap-4 md:gap-8 lg:gap-12 xl:gap-16 sm:p-4 lg:p-7 lg:rounded-lg">
      <article className="sm:basis-1/2 lg:basis-2/5">
        <header>
          <img
            src={ManFashion}
            alt="baju pria"
            width={500}
            height={500}
            className="w-full h-full aspect-video sm:aspect-[16/16] rounded-md object-cover object-center" />
        </header>
        <div className="grid mt-2 grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <img
              key={index}
              src={ManFashion}
              alt="baju pria"
              width={150}
              height={150}
              className="w-full h-full rounded-md object-cover object-center" />
          ))}
        </div>
      </article>
      <section className="*:leading-none px-1 sm:basis-1/2 lg:basis-3/5">
        <h1 className="text-xl lg:text-2xl mt-5 lg:mt-4">
          <strong>Baju bagus sekali</strong>
        </h1>
        <p className="mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam ipsa eligendi harum cupiditate exercitationem.</p>

        <div className="mt-5 flex items-center gap-3 border-y py-4 md:py-5">
          <h2 className="text-lg"><b>Rp. 149.000</b></h2>
          <h2 className="text-sm"><s>Rp. 210.000</s></h2>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Size</h2>
          <ul className="flex flex-wrap gap-2 mt-5">
            {['XS', 'S', 'M', 'L', 'XL'].map((size, index) => (
              <li key={index}>
                <RadioBtn detail={size} checkedRadioBtn={checkedRadioBtn} handleCheckedRadio={handleCheckedRadio} />
              </li>
            ))}
          </ul>
        </div>

        {windowWidth >= 640 && (
          <div className="border-t mt-5">
            <span className="w-max flex border rounded-lg overflow-hidden mt-5">
              <button type="button" aria-label="kurangi kuantiti" className="border-none px-2" onClick={() => handleClickBtnQty("dec")}>
                <img src={MinusIcon} alt="Minus ikon" width={24} height={24} />
              </button>
              <div
                contentEditable
                onInput={handleInputQty}
                onBlur={handleOnBlurQty}
                ref={inputQtyRef}
                className="w-14 px-3 py-2 grid place-content-center border-x"
              />
              <button type="button" aria-label="Tambah kuantiti" className="border-none px-2" onClick={() => handleClickBtnQty("inc")}>
                <img src={PlusIcon} alt="Plus ikon" width={24} height={24} />
              </button>
            </span>

            <span className="mt-5 flex gap-3 sm:gap-4">
              <button
                type="button"
                aria-label="masukkan keranjang"
                className="block py-2 w-32 border rounded-lg">
                Keranjang
              </button>
              <button
                type="button"
                aria-label="beli sekarang"
                className="block py-2 w-32 border rounded-lg">
                Beli
              </button>
            </span>
          </div>
        )}
      </section>
    </section>
  )
}

HeroSectDetailProduct.propTypes = {
  handleInputQty: PropTypes.func.isRequired,
  handleOnBlurQty: PropTypes.func.isRequired,
  inputQtyRef: PropTypes.object.isRequired,
  handleCheckedRadio: PropTypes.func.isRequired,
  checkedRadioBtn: PropTypes.string.isRequired,
  handleClickBtnQty: PropTypes.func.isRequired,
  qty: PropTypes.number.isRequired,
  setQty: PropTypes.func.isRequired
}

export default HeroSectDetailProduct
