import { Suspense } from "react"
import Herobanner from '../../../../assets/banner/hero-banner.webp'
import { Link } from "react-router-dom"
import Loading from "../../../elements/Loading"

function HeroBanner() {
  return (
    <Suspense fallback={<Loading paddingTop="pt-10" />}>
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