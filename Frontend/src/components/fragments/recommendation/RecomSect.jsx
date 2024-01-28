import ManFashion from '../../../assets/categories/man-fashion.webp'
import TitleSect from '../../elements/TitleSect'
import CardProduct from '../card/CardProduct'

function RecomSect() {
  return (
    <section className='mt-8 lg:mt-10 border-t-sect'>
      <TitleSect>Rekomendasi produk</TitleSect>
      <div className='mt-4 grid gap-2 sm:gap-3 lg:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 min-[1100px]:grid-cols-5 2xl:grid-cols-6'>
        {Array.from({ length: 10 }).map((_, index) => (
          <CardProduct
            key={index}
            href=''
            src={ManFashion}
            title='Baju bagus sekali'
            summary='lorem ipsum dolor sit amet. lorem ipsum dolor sit amet'
            price='Rp. 900.000'
            store='Tokoku'
          />
        ))}
      </div>
    </section>
  )
}

export default RecomSect
