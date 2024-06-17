import { useResizeWindow } from '../../hooks'
import MenuIcon from '../../assets/icons/menu.svg'
import NotifIcon from '../../assets/icons/notification.svg'
import ChatIcon from '../../assets/icons/chat2.svg'
import AvatarIcon from '../../assets/icons/DefaultAvatar.svg'
import { Link } from 'react-router-dom'
import LeftIcon from '../../assets/icons/arrowLeftWhite.svg'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MENUS_ADMIN_SIDEBAR } from '../../utils/constants'
import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  const { windowWidth } = useResizeWindow()
  const [isSidebarActive, setSidebarActive] = useState(false)

  const sidebarRef = useRef()
  const btnTriggerRef = useRef()

  const closeSidebar = () => setSidebarActive(false)

  const handleTriggerAside = useCallback((e) => {
    if (btnTriggerRef?.current?.contains(e.target)) {
      return setSidebarActive(prevActive => !prevActive)
    }

    if (sidebarRef?.current?.contains(e.target)) return;
    if (isSidebarActive) return setSidebarActive(false)
  }, [isSidebarActive])

  // close on click outside
  useEffect(() => {
    document.addEventListener('click', handleTriggerAside)
    return () => document.removeEventListener('click', handleTriggerAside)
  }, [handleTriggerAside])

  return (
    <>
      <header className="z-50 fixed top-0 left-0 flex items-center justify-between lg:justify-end lg:pl-80 padding-inline w-full py-4 border-b shadow-navtop bg-white">
        {windowWidth < 1024 && (
          <button type="button" aria-label="toggle sidebar" className='p-1' ref={btnTriggerRef}>
            <img src={MenuIcon} alt="ikon menu" width={28} height={28} />
          </button>
        )}

        <div className='flex items-center gap-3'>
          <button type="button" aria-label='tombol notifikasi' className='bg-neutral-200/70 p-[6px] rounded-full'>
            <img src={NotifIcon} alt="avatar" width={22} height={22} />
          </button>
          <button type="button" aria-label='tombol chat' className='bg-neutral-200/70 p-[6px] rounded-full'>
            <img src={ChatIcon} alt="avatar" width={22} height={22} />
          </button>
          <button type="button" aria-label='tombol pengguna' className='ml-1'>
            <img src={AvatarIcon} alt="avatar" width={40} height={40} />
          </button>
        </div>
      </header>

      <aside className={`z-[60] fixed top-0 left-0 w-72 h-screen background-black transition-all duration-300 sidebar-lg ${isSidebarActive ? '-translate-x-0' : '-translate-x-full'}`} ref={sidebarRef}>
        <div className='p-6 flex items-center justify-between'>
          <Link className='block w-max'>
            <h1 className='font-bold text-3xl leading-tight text-white'>Shopping</h1>
          </Link>

          {windowWidth < 1024 && (
            <button type="button" aria-label='tutup sidebar' onClick={closeSidebar} className='translate-y-1'>
              <img src={LeftIcon} alt="ikon kiri" width={30} height={30} />
            </button>
          )}
        </div>

        <div className='flex flex-col gap-2 mt-5 p-4 lg:mt-9'>
          {MENUS_ADMIN_SIDEBAR.map((menu, index) => (
            <Link to={menu.href} key={index} className='flex gap-[10px] items-center rounded-sm px-4 py-2 font-medium md:text-lg text-slate-50 hover:bg-gray-700 transition-all duration-200'>
              <img src={menu.icon} alt={menu.alt} width={24} height={24} />
              {menu.text}
            </Link>
          ))}
        </div>
      </aside>

      <main className='min-h-screen pt-24 pb-12 lg:pl-80 padding-inline bg-slate-100'>
        <Outlet />
      </main>
    </>
  )
}

export default DashboardLayout
