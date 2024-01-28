import { Link } from "react-router-dom"

function Logo() {
  return (
    <Link to="/" className='block' aria-label='Logo'>
      <h1 className='font-bold text-2xl lg:text-3xl -translate-y-1 leading-none'>Shopping</h1>
    </Link>
  )
}

export default Logo