import PropTypes from 'prop-types'
import { useRef } from 'react'

function LabelVariations({ variations }) {
  const labelVariations = useRef()
  labelVariations.current = []

  for (const [key, value] of Object.entries(variations)) {
    labelVariations.current = [...labelVariations.current, `${key}: ${value}`]
  }

  return (
    <span className="text-sm mt-1 w-4/5 sm:w-3/5 md:w-1/2 leading-tight line-clamp-2">{labelVariations.current.join(", ")}</span>
  )
}

LabelVariations.propTypes = {
  variations: PropTypes.objectOf(PropTypes.string).isRequired,
}

export default LabelVariations
