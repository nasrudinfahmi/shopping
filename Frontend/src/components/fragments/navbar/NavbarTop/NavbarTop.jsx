import PropTypes from 'prop-types'
import { Link, useSearchParams } from 'react-router-dom'
import NotifIcon from '../../../../assets/icons/notification.svg'
import CartIcon from '../../../../assets/icons/cart.svg'
import UserIcon from '../../../../assets/icons/user.svg'
import Logo from '../../../elements/Logo'
import SearchProducts from '../../../elements/SearchProducts'
import { useEffect, useState } from 'react'
import { useResizeWindow } from '../../../../hooks'

function NavbarTop({ widthInputSearch = true }) {
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

      {widthInputSearch && (
        <SearchProducts searchValue={searchValue} onChangeSearchInput={onChangeSearchInput} />
      )}

      <div className='flex w-20 sm:w-32 justify-evenly sm:justify-around shrink-0'>
        <Link className='p-1' aria-label='notifikasi'>
          <img src={NotifIcon} alt="Ikon notifikasi" width={24} height={24} />
        </Link>
        <Link to='/cart' className='p-1' aria-label='keranjang belanja'>
          <img src={CartIcon} alt="Ikon keranjang belanja" width={24} height={24} />
        </Link>
        {windowWidth >= 640 && (
          <Link to='/me' className='block p-1' aria-label='profil saya'>
            <img src={UserIcon} alt="Ikon Pengguna" width={24} height={24} />
          </Link>
        )}
      </div>
    </nav>
  )
}

NavbarTop.propTypes = {
  widthInputSearch: PropTypes.bool,
}

export default NavbarTop