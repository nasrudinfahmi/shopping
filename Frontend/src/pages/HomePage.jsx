import HeroBanner from "../components/fragments/heroSect/HeroBanner/HeroBanner"
import CategoriesSect from "../components/fragments/Categories/CategoriesSect"
import RecomSect from "../components/fragments/recommendation/RecomSect"
import PageLayout from "../components/layouts/PageLayout"
import NavbarBottom from '../components/fragments/navbar/NavbarBottom/NavbarBottom'

function HomePage() {
  return (
    <PageLayout NavBottom={<NavbarBottom />}>
      <HeroBanner />
      <CategoriesSect />
      <RecomSect />
    </PageLayout>
  )
}

export default HomePage