import PropTypes from 'prop-types'
import NavbarTop from '../fragments/navbar/NavbarTop/NavbarTop'
import NavbarBottom from '../fragments/navbar/NavbarBottom/NavbarBottom'
import { useResizeWindow } from '../../hooks'

function PageLayout({ children }) {
  const { windowWidth } = useResizeWindow()

  return (
    <>
      <header>
        <NavbarTop />
        {windowWidth < 640 && <NavbarBottom />}
      </header>
      <main className="bg-neutral-100/70 w-full min-h-screen padding-inline pt-16 sm:pt-20 lg:pt-24 pb-20">
        {children}
      </main>
    </>
  )
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default PageLayout
