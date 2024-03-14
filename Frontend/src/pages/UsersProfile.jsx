import { Link } from "react-router-dom";
import CloseIcon from '../assets/icons/x.svg';
import DefaultAvatar from '../assets/icons/DefaultAvatar.svg';
import { useSeller, useUser } from "../hooks";
import { useMemo } from "react";
import SettingIcon from '../assets/icons/setting2.svg';
import { MENUS_USER_PROFILE } from "../utils/constants";

function UsersProfile() {
  const { userInfo } = useUser();
  const { seller, loading } = useSeller()

  const userProfileImage = useMemo(() => {
    return userInfo?.photoURL ? userInfo?.photoURL : DefaultAvatar;
  }, [userInfo?.photoURL]);

  if (loading) return <h1>Loadig bos!</h1>
  return (
    <>
      <header className='bg-white fixed w-full top-0 left-0 px-3 py-2 sm:py-3 shadow-navtop border-b border-slate-50 flex items-center gap-2 *:py-1 font-semibold text-lg'>
        <Link to={-1} aria-label="Halaman Sebelumnya" title="Halaman Sebelumnya" className="block leading-none pr-2">
          <img src={CloseIcon} alt="Tombol Kembali" width={24} height={24} />
        </Link>
        <h1 className="leading-none">Profil Saya</h1>
      </header>

      <main className="w-full min-h-screen pb-4 bg-white">
        <section className="pb-1 pt-16">
          <Link to="/me/editprofile" title="Edit Profil" aria-label="Edit Profil" className="flex px-3 w-full items-center gap-2">
            <div className="min-w-max">
              <img src={userProfileImage} alt="Gambar Profil" width={53} height={53} />
            </div>
            <div className="*:leading-normal *:tracking-wide *:line-clamp-1 basis-full">
              <h1 className="font-semibold text-lg">{userInfo?.displayName || 'Pengguna Tamu'}</h1>
              {userInfo?.phoneNumber && <span>{userInfo.phoneNumber}</span>}
              {!userInfo && <span>Anonymous</span>}
            </div>
            <div className="min-w-max">
              <img src={SettingIcon} alt="Tombol Pengaturan" width={21} height={21} />
            </div>
          </Link>

          <div className="flex gap-4 px-3 items-center justify-center mt-4 ">
            {seller ? (
              <Link to="/dashboard" title="Dashboard Toko" aria-label="Dashboard Toko" className="block basis-1/2 text-center py-2 rounded-md text-sm font-semibold tracking-wide leading-none border border-slate-300 shadow-sm hover:bg-slate-50/65">
                Dashboard Toko
              </Link>
            ) : (
              <Link to="/mystore" title="Buka Toko Gratis" aria-label="Buka Toko Gratis" className="block basis-1/2 text-center py-2 rounded-md text-sm font-semibold tracking-wide leading-none border border-slate-300 shadow-sm hover:bg-slate-50/65">
                Buka Toko Gratis
              </Link>
            )}
            <Link to="" title="Daftar Affiliate" aria-label="Daftar Affiliate" className="block basis-1/2 text-center py-2 rounded-md text-sm font-semibold tracking-wide leading-none border border-slate-300 shadow-sm hover:bg-slate-50/65">
              Daftar Affiliate
            </Link>
          </div>
        </section>

        <MenusUserProfile />
      </main>
    </>
  )
}

const MenusUserProfile = () => {
  return (
    <>
      {Object.entries(MENUS_USER_PROFILE).map(([key, menus]) => (
        <section key={key} className="pt-2 flex flex-col gap-1">
          <span className="block bg-neutral-100 py-1 my-1 w-full" />
          {menus.map(menu => (
            <Link key={menu.text} to={menu.path} title={menu.text} aria-label={menu.text} className="flex items-center gap-2 basis-full py-2 px-3 leading-tight bg-white hover:bg-slate-50/70">
              <img src={menu.icon} alt={menu.text} width={19} height={19} />
              {menu.text}
            </Link>
          ))}
        </section>
      ))}
    </>
  )
}


export default UsersProfile;
