import PropTypes from 'prop-types'

function Loading({ paddingTop = 'pt-24', paddingBlock = 'py-0' }) {
  return (
    <div className={`fixed top-0 left-0 ${paddingTop} w-screen flex place-content-center z-[99999999999999999999999]`}>
      <div className={`w-max h-full ${paddingBlock} py-3 px-6 rounded-md shadow-sm bg-white`}>
        <div className="loader" />
      </div>
    </div>
  )
}

Loading.propTypes = {
  paddingTop: PropTypes.string,
  paddingBlock: PropTypes.string,
}

export default Loading