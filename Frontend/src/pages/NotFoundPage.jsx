import NavbarBottom from "../components/fragments/navbar/NavbarBottom/NavbarBottom"
import PageLayout from "../components/layouts/PageLayout"

function NotFoundPage() {
  return (
    <PageLayout NavBottom={<NavbarBottom />}>
      <section className="w-full h-[50vh] flex flex-col *:text-slate-800">
        <h1 className="m-auto text-9xl font-extrabold">404</h1>
        <span className="block mx-auto px-10 font-extrabold text-3xl text-center leading-none">Halaman tidak ditemukan</span>
      </section>
    </PageLayout>
  )
}

export default NotFoundPage