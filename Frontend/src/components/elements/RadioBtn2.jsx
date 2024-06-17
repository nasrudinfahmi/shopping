import PropTypes from 'prop-types'

function RadioBtn2({ id, label, value, setTagsSelected }) {
  const onChange = () => {
    setTagsSelected(prevTags => ({ ...prevTags, [label]: value }))
  }

  return (
    <label htmlFor={id}>
      <input
        type="radio"
        name={label}
        id={id}
        className="peer"
        hidden
        onChange={onChange}
      />
      <span className="block w-max m-auto border bg-white peer-checked:bg-orange-50 peer-checked:border-orange-500 px-3 py-1 sm:py-1.5 rounded-md">{value}</span>
    </label>
  )
}

RadioBtn2.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setTagsSelected: PropTypes.func.isRequired,
}

export default RadioBtn2