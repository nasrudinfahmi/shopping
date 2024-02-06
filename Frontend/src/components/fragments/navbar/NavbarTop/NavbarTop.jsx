import { Link, useSearchParams } from 'react-router-dom'
import NotifIcon from '../../../../assets/icons/notification.svg'
import CartIcon from '../../../../assets/icons/cart.svg'
import UserIcon from '../../../../assets/icons/user.svg'
import Logo from '../../../elements/Logo'
import { useResizeWindow } from '../../../../hooks'
import { useEffect, useState } from 'react'

function NavbarTop() {
  const { windowWidth } = useResizeWindow()

  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('product') || '')

  const onChangeSearchInput = (e) => {
    const searchKeyword = e.target.value.toLowerCase()
    if (searchKeyword.trim() === '') {
      setSearchParams('')
    } else {
      setSearchParams({ product: searchKeyword.trim() })
    }
    setSearchValue(searchKeyword)
  }

  useEffect(() => {
    if (!searchParams.get('product')) setSearchValue('')
  }, [searchParams])

  return (
    <nav className="z-[9999999] fixed top-0 w-full flex items-center gap-4 sm:gap-8 padding-inline py-2 sm:py-3 shadow-navtop border-b border-b-slate-200/40 bg-white">
      {windowWidth >= 640 && <Logo />}

      {windowWidth >= 1024 && (
        <div className='flex gap-5 xl:gap-10 items-center w-full justify-center *:leading-none'>
          <Link aria-label='produk baru'>Produk Baru</Link>
          <Link aria-label='kategori'>Kategori</Link>
          <Link aria-label='rekomendasi'>Rekomendasi</Link>
          <Link aria-label='pengiriman'>Pengiriman</Link>
        </div>
      )}

      <label htmlFor="search" className='basis-full lg:basis-1/2'>
        <input
          type="search"
          placeholder="Cari di shopping"
          aria-label="Cari produk di shopping"
          onChange={(e) => onChangeSearchInput(e)}
          value={searchValue}
          autoComplete='off'
          spellCheck={false}
          id='search'
          className="shrink border-none w-full outline outline-1 outline-slate-400 rounded-xl py-1 px-3 sm:px-4 focus:outline-teal-500 focus:shadow-sm"
        />
      </label>

      <div className='flex w-20 sm:w-32 justify-evenly sm:justify-around shrink-0'>
        <Link className='p-1' aria-label='notifikasi'>
          <img src={NotifIcon} alt="Ikon notifikasi" width={24} height={24} />
        </Link>
        <Link className='p-1' aria-label='keranjang belanja'>
          <img src={CartIcon} alt="Ikon keranjang belanja" width={24} height={24} />
        </Link>
        {windowWidth >= 640 && (
          <Link className='block p-1' aria-label='profil saya'>
            <img src={UserIcon} alt="Ikon Pengguna" width={24} height={24} />
          </Link>
        )}
      </div>
    </nav>
  )
}

export default NavbarTop