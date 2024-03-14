import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import LeftIcon from '../../../../assets/icons/arrowLeft.svg'
import ChatIcon from '../../../../assets/icons/chat.svg'

function NavbarTop2({ children }) {
  return (
    <nav className="z-[9999999] fixed top-0 w-full flex items-center justify-between gap-4 sm:gap-8 padding-inline py-2 sm:py-3 shadow-navtop border-b border-b-slate-200/40 bg-white">

      <div className='flex items-center gap-2'>
        <Link to={-1} className='translate-y-[0.5px]'>
          <img src={LeftIcon} alt="ikon kembali" width={24} height={24} />
        </Link>
        <h1 className='font-semibold text-xl -translate-y-px'>
          {children}
        </h1>
      </div>

      <Link>
        <img src={ChatIcon} alt="ikon kembali" width={24} height={24} />
      </Link>
    </nav>
  )
}

NavbarTop2.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

export default NavbarTop2