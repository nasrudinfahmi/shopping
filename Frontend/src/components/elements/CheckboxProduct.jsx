import PropTypes from 'prop-types'
import CheckIcon from '../../assets/icons/check.svg'

function CheckboxProduct({ label, ariaLabel, toggleCheck, checked, id }) {

  return (
    <label htmlFor={id} className="w-max flex gap-2 items-center shrink-0 cursor-pointer">
      <input type="checkbox" name="checkProduct" id={id} defaultChecked={checked} onClick={toggleCheck} hidden aria-label={ariaLabel} />
      <span className={`grid place-content-center w-[17px] sm:w-5 h-[17px] sm:h-5 overflow-hidden rounded border border-slate-500 ${checked ? 'bg-green-400' : 'bg-white'} transition-colors`}>
        <img src={CheckIcon} alt="ikon ceklis" width={24} height={24} className={`${checked ? 'scale-100' : 'scale-0'} transition-all`} />
      </span>
      {label && <span className="leading-none -translate-y-px">{label}</span>}
    </label>
  )
}

CheckboxProduct.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  toggleCheck: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
}

export default CheckboxProduct
