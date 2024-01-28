import { Suspense } from "react"
import Herobanner from '../../../assets/banner/hero-banner.webp'
import { Link } from "react-router-dom"

function HeroBanner() {
  return (
    <Suspense fallback={<h1 className="w-full h-[350px] grid place-content-center">loading ...</h1>}>
      <section className="w-full h-30vh bg-slate-50">
        <Link aria-label="Big sale!! Up to 50% off" title="Big sale!! Up to 50% off">
          <img
            src={Herobanner}
            alt="Hero banner"
            width={1000}
            height={500}
            className="w-full h-full object-cover bg-slate-50 rounded-md"
          />
        </Link>
      </section>
    </Suspense>
  )
}

export default HeroBanner