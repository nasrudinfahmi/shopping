import MenuIcon from '../../assets/icons/menu.svg'
import AvatarIcon from '../../assets/icons/DefaultAvatar.svg'
import NotifIcon from '../../assets/icons/notification.svg'
import ChatIcon from '../../assets/icons/chat2.svg'
import LeftIcon from '../../assets/icons/arrowLeftWhite.svg'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useEditor, useResizeWindow } from '../../hooks/index'
import { MENUS_ADMIN_SIDEBAR } from '../../utils/constants'
import InputForm from '../../components/elements/InputForm'
import RadioBtn from '../../components/elements/RadioBtn'
import RichTextEditor from '../../components/elements/RichTextEditor'
import { getValueById } from '../../utils/utils'


function AddProductPage() {
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [statusProduck, setStatusProduct] = useState('')
  const { windowWidth } = useResizeWindow()
  const { editorInstanceRef, initEditor } = useEditor()

  const editorRef = useRef(null)

  useEffect(() => {
    if (!editorRef.current) {
      initEditor()
      editorRef.current = true
    }
  }, [editorInstanceRef, initEditor])

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

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const productName = getValueById('nama produk')
      const price = getValueById('harga')
      const summary = getValueById('ringkasan')
      const delivery = getValueById('pengiriman')
      const brand = getValueById('merek')
      const radios = Array.from(document.querySelectorAll('[name="detail"]')).find(radio => radio.checked ? radio : null)?.value
      const descriptionProduct = await editorInstanceRef.current.save()

      console.log({
        productName,
        price: Number(price),
        summary,
        delivery,
        brand,
        radios,
        description: descriptionProduct.blocks,
      });
    } catch (error) {
      console.log(error);
    }
  }

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
            <button type="button" aria-label='tutup sidebar' onClick={closeSidebar}>
              <img src={LeftIcon} alt="ikon kiri" width={30} height={30} />
            </button>
          )}
        </div>

        <div className='flex flex-col gap-2 mt-5 p-4 lg:mt-9'>
          {MENUS_ADMIN_SIDEBAR.map((menu, index) => (
            <Link key={index} className='flex gap-[10px] items-center rounded-sm px-4 py-2 font-medium md:text-lg text-slate-50 hover:bg-gray-700 transition-all duration-200'>
              <img src={menu.icon} alt={menu.alt} width={24} height={24} />
              {menu.text}
            </Link>
          ))}
        </div>
      </aside>

      <main className='min-h-[200vh] pt-24 lg:pl-80 padding-inline bg-[#F1F5F9]'>
        <h1 className='text-3xl font-semibold text-slate-900'>produk baru</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2 px-3 sm:px-8 lg:px-10 pt-4 pb-8 sm:pb-10 mt-7 bg-white rounded-md'>
          <InputForm id='nama produk' placeholder='nama produk' type='text' />
          <InputForm id='harga' placeholder='harga produk' type='number' />
          <InputForm id='ringkasan' placeholder='ringkasan produk' type='text' optional={true} />
          <InputForm id='pengiriman' placeholder='pengiriman' type='text' />
          <InputForm id='merek' placeholder='merek produk' type='text' />
          <span className='mb-px mt-2 pl-px text-sm font-semibold text-slate-700'>status produk</span>
          <div className='flex gap-2 items-center'>
            <RadioBtn checkedRadioBtn={statusProduck} handleCheckedRadio={(e) => setStatusProduct(e.target.value)} detail='ready' />
            <RadioBtn checkedRadioBtn={statusProduck} handleCheckedRadio={(e) => setStatusProduct(e.target.value)} detail='preorder' />
          </div>
          <RichTextEditor />
          <button type="submit" aria-label='tambah produk' className='py-1 border w-full text-center rounded mt-10'>tambah produk</button>
        </form>
      </main>
    </>
  )
}

export default AddProductPage