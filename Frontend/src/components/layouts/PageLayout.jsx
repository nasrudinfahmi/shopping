import PropTypes from 'prop-types'
import NavbarTop from '../fragments/navbar/NavbarTop/NavbarTop'
import { useResizeWindow } from '../../hooks'

function PageLayout({ children, NavBottom }) {
  const { windowWidth } = useResizeWindow()

  return (
    <>
      <header>
        <NavbarTop />
        {windowWidth < 640 && NavBottom !== undefined && NavBottom}
      </header>
      <main className="bg-neutral-100/70 w-full min-h-screen padding-inline pt-16 sm:pt-20 lg:pt-24 pb-20">
        {children}
      </main>
    </>
  )
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  NavBottom: PropTypes.node,
}

export default PageLayout
