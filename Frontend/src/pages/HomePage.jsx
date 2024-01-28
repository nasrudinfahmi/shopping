import HeroBanner from "../components/fragments/HeroBanner/HeroBanner"
import CategoriesSect from "../components/fragments/Categories/CategoriesSect"
import RecomSect from "../components/fragments/recommendation/RecomSect"
import PageLayout from "../components/layouts/PageLayout"

function HomePage() {
  return (
    <PageLayout>
      <HeroBanner />
      <CategoriesSect />
      <RecomSect />
    </PageLayout>
  )
}

export default HomePage