import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function CardCategory({ src, title }) {
  return (
    <Link title={"kategori " + title} aria-label={"kategori " + title} className='min-w-[80px] sm:min-w-[140px] relative rounded-lg overflow-hidden shadow-sm group'>
      <article>
        <header>
          <img
            src={src}
            alt="teknologi"
            width={150}
            height={150}
            className='w-full h-full object-cover object-center'
          />
        </header>
        <div
          className='block absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-400/50 to-transparent h-3/5 group-hover:from-slate-200 group-hover:h-full group-focus:from-slate-200 group-focus:h-full origin-bottom duration-75 ease-linear w-full text-center'>
          <span className='font-semibold leading-none text-sm sm:text-lg sm:group-hover:text-xl sm:group-hover:font-bold sm:group-focus:font-bold sm:group-focus:text-xl sm:group-hover:-translate-y-2 sm:group-focus:-translate-y-2 ease-linear duration-100 text-black block absolute bottom-2 left-1/2 -translate-x-1/2 z-40'>{title}</span>
        </div>
      </article>
    </Link>
  )
}

export default CardCategory

CardCategory.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}