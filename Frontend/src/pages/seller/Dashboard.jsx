import PropTypes from 'prop-types'
import { useResizeWindow } from "../../hooks"
import BearishIcon from '../../assets/icons/Bearish.svg'
import BullishIcon from '../../assets/icons/Bullish.svg'

function Dashboard() {
  const { windowWidth } = useResizeWindow()

  return (
    <>
      <section className="flex items-center justify-between *:select-none">
        <h1 className='w-max text-3xl font-semibold text-slate-900'>Dashboard</h1>
        {windowWidth >= 768 && (
          <h1 className='w-max text-right text-3xl font-semibold text-slate-900'>Selamat pagi, Fahmi</h1>
        )}
      </section>

      <section className="mt-7 grid gap-4 grid-cols-1 min-[570px]:grid-cols-2 md:grid-cols-3">
        <CardAnalytic title='Total Produk' number={20} status='Bearish' percentage={0.21} />
        <CardAnalytic title='Produk Terjual' number={49} status='Bullish' percentage={0.35} />
        <CardAnalytic title='Total Pendapatan' number={20} status='Bullish' percentage={12.1} />
      </section>
    </>
  )
}

function CardAnalytic({ title, number, status = "Bullish", percentage = 0 }) {
  let statusState = status === 'Bullish' ? BullishIcon : BearishIcon;
  if (!percentage) statusState = "Bullish"

  return (
    <div className="flex flex-col gap-3 bg-white py-6 px-7 min-h-28 rounded-xl drop-shadow-sm">
      <div className="size-11 bg-slate-100 rounded-full" />
      <div>
        <h1 className="text-2xl font-semibold leading-tight">{number}</h1>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-medium text-slate-500">{title}</span>
          <span className={`flex items-center gap-1 ${status === 'Bullish' ? 'text-green-500' : 'text-red-500'}`}>
            {percentage}%
            <img src={statusState} alt="ikon panah" width={16} height={16} />
          </span>
        </div>
      </div>
    </div>
  )
}

CardAnalytic.propTypes = {
  title: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  status: PropTypes.oneOf(["Bullish", "Bearish"]),
  percentage: PropTypes.number,
}

export default Dashboard