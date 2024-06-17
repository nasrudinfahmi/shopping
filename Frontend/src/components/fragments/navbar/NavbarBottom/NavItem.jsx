import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'

function NavItem({ src, alt, label, href }) {
  return (
    <li>
      <Link to={href} aria-label={label} className='flex flex-col rounded-xl px-2 py-px justify-center items-center hover:bg-neutral-50'>
        <img src={src} alt={alt} width={24} height={24} />
        <span className='text-xs line-clamp-1'>{label}</span>
      </Link>
    </li>
  )
}

export default NavItem

NavItem.propTypes = {
  src: Proptypes.string.isRequired,
  alt: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  href: Proptypes.string.isRequired,
}