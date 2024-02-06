import PropTypes from 'prop-types'
import NavbarTop from '../fragments/navbar/NavbarTop/NavbarTop'
import { useResizeWindow } from '../../hooks'
import { useSearchParams } from 'react-router-dom'
import TitleSect from '../elements/TitleSect'
import CardProduct from '../fragments/card/CardProduct'
import ManFashion from '../../assets/categories/man-fashion.webp'

function PageLayout({ children, NavBottom }) {
  const { windowWidth } = useResizeWindow()
  const [searchParams] = useSearchParams()

  return (
    <>
      <header>
        <NavbarTop />
        {windowWidth < 640 && NavBottom !== undefined && NavBottom}
      </header>
      <main className="bg-neutral-100/70 w-full min-h-screen padding-inline pt-16 sm:pt-20 lg:pt-24 pb-20">
        {!searchParams.get('product') && children}
        {searchParams.get('product') && (
          <section className='mt-8 lg:mt-10 border-t-sect'>
            <TitleSect>{searchParams.get('product')}</TitleSect>
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
        )}
      </main>
    </>
  )
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  NavBottom: PropTypes.node,
}

export default PageLayout
