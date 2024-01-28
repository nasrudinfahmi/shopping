import PropTypes from 'prop-types'

function TitleSect({ children }) {
  return (
    <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold'>{children}</h1>
  )
}

TitleSect.propTypes = {
  children: PropTypes.string.isRequired
}

export default TitleSect
