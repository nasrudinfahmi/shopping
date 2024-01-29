import PropTypes from 'prop-types'

function RadioBtn({ checkedRadioBtn, handleCheckedRadio, detail }) {
  return (
    <label htmlFor={`detail-${detail}`} className={`flex border w-min h-min px-4 py-1 rounded-lg leading-none bg-white shadow-sm ${checkedRadioBtn === detail && "border-orange-500 "}`}>
      <span className="block m-auto">{detail}</span>
      <input type="radio" name={`detail`} id={`detail-${detail}`} aria-label={`detail-${detail}`} value={detail} defaultChecked={checkedRadioBtn === detail} onChange={(e) => handleCheckedRadio(e)} hidden />
    </label>
  )
}

RadioBtn.propTypes = {
  checkedRadioBtn: PropTypes.string.isRequired,
  handleCheckedRadio: PropTypes.func.isRequired,
  detail: PropTypes.string.isRequired,
}

RadioBtn.defaultProps = {
  detail: ""
}

export default RadioBtn
