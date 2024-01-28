import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function CardProduct({ href, src, className, title, summary, price, store }) {
  return (
    <Link to={href} aria-label={`produk ${title}`} className={`border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow focus:shadow ${className}`}>
      <article>
        <header>
          <img
            src={src}
            alt="Gambar produk"
            width={300}
            height={300}
            className='w-full object-cover object-center' />
        </header>
        <div className='*:leading-none mt-2 p-2'>
          <h2 className='font-semibold xl:text-lg mb-2 line-clamp-1'>{title}</h2>
          <p className='text-sm xl:text-base leading-none xl:leading-none line-clamp-2 text-slate-700'>{summary}</p>
          <span className='mt-3 block font-semibold text-slate-800'>{price}</span>
          <span className='mt-3 pb-1 block font-semibold text-slate-800'>{store}</span>
        </div>
      </article>
    </Link>
  )
}

CardProduct.propTypes = {
  href: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  store: PropTypes.string.isRequired,
}

export default CardProduct
