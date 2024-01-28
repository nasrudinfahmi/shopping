import { Link } from 'react-router-dom'
import { CATEGORIES_HOME } from '../../../utils/constants'
import CardCategory from '../card/CardCategory'
import TitleSect from '../../elements/TitleSect'

export default function CategoriesSect() {

  return (
    <section className='mt-7 lg:mt-10 *:select-none border-t-sect'>
      <span className='flex justify-between items-end'>
        <TitleSect>Top kategori</TitleSect>
        <Link
          aria-label='Lihat semua kategori'
          title='Lihat semua kategori'
          className='text-blue-800 hover:text-blue-700 focus:text-blue700 font-semibold'>Lihat semua</Link>
      </span>
      <div className='mt-4 grid grid-rows-2 grid-flow-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 w-full overflow-x-auto scrollbar-custom pb-2'>
        {CATEGORIES_HOME.map((category, index) => (
          <CardCategory key={index} {...category} />
        ))}
        {CATEGORIES_HOME.map((category, index) => (
          <CardCategory key={index} {...category} />
        ))}
      </div>
    </section>
  )
}
