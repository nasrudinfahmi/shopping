import HeroBanner from "../components/fragments/heroSect/HeroBanner/HeroBanner"
import CategoriesSect from "../components/fragments/Categories/CategoriesSect"
import RecomSect from "../components/fragments/recommendation/RecomSect"
import PageLayout from "../components/layouts/PageLayout"
import NavbarBottom from '../components/fragments/navbar/NavbarBottom/NavbarBottom'
import { Link } from "react-router-dom"
import { auth } from "../lib/firebase/init"
import { useSeller, useUser } from "../hooks"

function HomePage() {
  const { logout, userInfo } = useUser()
  const { seller } = useSeller()

  return (
    <PageLayout NavBottom={<NavbarBottom />}>
      <Link to={'/me/editprofile'} className="block p-2 bg-orange-50">edit profile</Link>
      <Link to={'/auth'} className="block p-2 bg-orange-200">auth</Link>
      <Link to={'/me'} className="block p-2 bg-orange-400">profil saya</Link>
      <Link to={'/dashboard/new-product'} className="block p-2 bg-orange-500">add product</Link>
      <button type="button" onClick={() => console.log(auth.currentUser)} className="bg-green-300 px-4 py-1">current user</button>
      <button type="button" onClick={logout} className="px-4 py-1 bg-teal-500">logout</button>
      <button type="button" onClick={() => console.log({ userInfo })} className="bg-orange-100 p-2">console.log(userInfo)</button>
      <button type="button" onClick={() => console.log({ seller })} className="bg-orange-200 p-2">console.log(seller)</button>
      <HeroBanner />
      <CategoriesSect />
      <RecomSect />
    </PageLayout>
  )
}

export default HomePage