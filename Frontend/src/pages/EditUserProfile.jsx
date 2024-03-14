import { deleteDataUser, updateDataUser } from "../lib/firebase/services/userFirestore";
import { deleteFileFromStorage, uploadFileToStorage } from "../lib/firebase/services/storage";
import { useResizeWindow, useSeller, useUser } from "../hooks";
import InputForm from "../components/elements/InputForm";
import NavbarBottom from "../components/fragments/navbar/NavbarBottom/NavbarBottom";
import NavbarTop2 from "../components/fragments/navbar/NavbarTop/NavbarTop2";
import UserIcon from "../assets/icons/user.svg";
import TelIcon from "../assets/icons/telIcon.svg";
import MapIcon from "../assets/icons/map.svg";
import DefaultAvatar from "../assets/icons/DefaultAvatar.svg";
import TrashIcon from "../assets/icons/trash.svg";
import { useEffect, useState } from "react";
import { saveUserInfoToLocalstorage, validateIndonesianPhoneNumber } from "../utils/utils";
import { deleteUser, getRedirectResult, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase/init";
import { useNavigate } from "react-router-dom";
import { Toast } from "../lib/sweetalert2/init";
import Swal from "sweetalert2";
import { deleteSeller } from "../lib/firebase/services/sellerFirestore";
import { deleteAllSellersProducts } from "../lib/firebase/services/productFirebase";


function EditUserProfile() {
  const { windowWidth } = useResizeWindow()
  const { deleteAccount, setUserInfo } = useUser()
  const { setSeller } = useSeller()
  const userInfo = JSON.parse(localStorage.getItem('user')) || null
  const [usersData, setUsersData] = useState({})
  const [defaultImgUser, setDefaultImgUser] = useState(userInfo.photoURL || DefaultAvatar)

  const { displayName, phoneNumber, address, photoURL } = userInfo;

  const navigate = useNavigate()

  useEffect(() => {
    document.getElementById('username').value = displayName;
    document.getElementById('telepon').value = phoneNumber;
    document.getElementById('alamat lengkap').value = address?.fullAddress || '';
    document.getElementById('rincian alamat').value = address?.addressDetails || '';
    setUsersData(prevData => ({ ...prevData, userImgProfile: photoURL }))
    if (userInfo?.photoURL) setDefaultImgUser(photoURL)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInputChange = (e) => {
    let key = e.target.id;
    if (key === 'alamat lengkap') key = 'fullAddress';
    if (key === 'rincian alamat') key = 'addressDetails';
    if (key === 'telepon') key = 'phoneNumber';
    if (key === 'username') key = 'displayName';

    setUsersData(prevData => {
      let data;
      if (key === 'fullAddress' || key === 'addressDetails') {
        data = { ...prevData, address: { ...prevData.address, [key]: e.target.value.trim() } }
      } else {
        data = { ...prevData, [key]: e.target.value.trim() }
      }

      return data;
    })
  }

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    const allowedExtension = /(\.jpg|\.jpeg|\.webp|\.png|\.aviv)$/i;

    if (!allowedExtension.exec(file.name)) {
      alert('ext tidak sesuai')
      return e.target.value = ''
    }

    if (file.size > 1 * 1024 * 1024) {
      alert('gambar terlalu besar')
      return e.target.value = ''
    }

    setUsersData(prevData => ({ ...prevData, userImgProfile: file }))

    const blobPreviewImgProfile = URL.createObjectURL(file)
    setDefaultImgUser(blobPreviewImgProfile)
  }

  const handleDeleteImg = () => {
    document.getElementById('userImg').value = ''
    setDefaultImgUser(DefaultAvatar)
    setUsersData(prevData => {
      return { ...prevData, userImgProfile: null }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (usersData.phoneNumber) {
        const isPhoneNumberValid = validateIndonesianPhoneNumber(phoneNumber)
        if (!isPhoneNumberValid) throw new Error('Nomor telepon tidak valid!')
      }

      if (!usersData.userImgProfile && userInfo.photoURL) {
        await deleteFileFromStorage(userInfo.photoURL)
        await updateProfile(auth.currentUser, { photoURL: null })

        if (Object.keys(usersData).length > 1) {
          const data = { ...usersData }
          delete data?.userImgProfile;
          data.photoURL = null;

          await updateDataUser(auth.currentUser.email, data)
          if (usersData.displayName) await updateProfile(auth.currentUser, { displayName: usersData.displayName })
        } else {
          await updateDataUser(auth.currentUser.email, { photoURL: null })
        }

        saveUserInfoToLocalstorage(auth.currentUser.email)

        Toast.fire({
          icon: 'success',
          title: 'Berhasil memperbarui profil',
        })

        return navigate('/', { replace: true })
      }

      if (usersData.userImgProfile && usersData.userImgProfile !== userInfo.photoURL) {
        const id = Math.random().toString(36).substring(2);
        const imgName = `${id}-${usersData.userImgProfile?.name}`;
        const pathUrl = `user-photo-profile/${imgName}`;

        const photoURL = await uploadFileToStorage(pathUrl, usersData.userImgProfile)
        await deleteFileFromStorage(userInfo.photoURL)

        const data = { ...usersData }

        delete data?.userImgProfile;
        data.photoURL = photoURL;

        await updateDataUser(auth.currentUser.email, data)
        await updateProfile(auth.currentUser, { photoURL })
      }

      if (usersData.userImgProfile === userInfo.photoURL) {
        const isInValidData = Object.values(usersData).every(value => !value)

        if (isInValidData) throw new Error('Data sama!')

        const data = { ...usersData }
        delete data?.userImgProfile;

        await updateDataUser(auth.currentUser.email, data)
      }

      if (usersData.displayName) await updateProfile(auth.currentUser, { displayName: usersData.displayName })
      saveUserInfoToLocalstorage(auth.currentUser.email)

      Toast.fire({
        icon: 'success',
        title: 'Berhasil memperbarui profil',
      })

      return navigate('/', { replace: true })
    } catch (error) {
      console.log(error.message)
      Toast.fire({
        icon: 'error',
        title: error.message,
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const isSuccessDeleteAccount = await deleteAccount(auth.currentUser.email)

      if (isSuccessDeleteAccount) {
        setSeller(null)
        return navigate('/', { replace: true })
      }

    } catch (error) {
      console.log(error.message)
      Toast.fire({
        icon: 'error',
        title: error.message,
      })
    }
  }

  useEffect(() => {
    (async function () {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          const userPhotoProfile = JSON.parse(localStorage.getItem('user'))?.photoURL;

          const promises = [
            deleteUser(auth.currentUser),
            deleteFileFromStorage(userPhotoProfile),
            deleteDataUser(userInfo.email),
          ]

          if (userInfo?.uids && userInfo.role === "seller") {
            promises.push(deleteSeller(userInfo.uids), deleteAllSellersProducts(userInfo.uids))
          }

          await Promise.all(promises)

          auth.updateCurrentUser(null)
          localStorage.removeItem('user')
          setUserInfo(null)
          setSeller(null)
          console.log('Berhasil menghapus akun.')

          Swal.fire({
            icon: "success",
            title: "Akun berhasil dihapus",
            text: "Jangan lupa untuk menjaga semangatmu yah 😇",
          });

          navigate('/', { replace: true })
        }
      } catch (error) {
        console.log(error.message)
        Toast.fire({
          icon: 'error',
          text: error.message,
        })
      }
    })()
  }, [navigate, setSeller, setUserInfo, userInfo.email, userInfo.role, userInfo.uids])

  return (
    <>
      <header>
        <NavbarTop2>Edit Profil</NavbarTop2>
        {windowWidth <= 640 && <NavbarBottom />}
      </header>
      <main className="bg-neutral-100/70 w-full min-h-screen padding-inline pt-16 sm:pt-20 lg:pt-24 pb-20">

        <form onSubmit={handleSubmit} className="w-full rounded-xl drop-shadow-sm flex flex-col gap-1.5 min-h-[50vh] pt-[8%] pb-[10%] px-[5%] sm:px-[10%] bg-white">
          <div className="relative mx-auto">
            <img className="aspect-square object-cover object-center rounded-full shadow sm:w-28 sm:h-2w-28 md:w-32 md:h-32" src={defaultImgUser} alt="default image" width={75} height={75} />
            <button type="button" onClick={handleDeleteImg} className="absolute -top-1 -right-3 sm:-right-1 sm:top-0 rounded-full p-1 bg-white" title="hapus img profil" aria-label="hapus img profil">
              <img src={TrashIcon} alt="ikon hapus" width={24} height={24} className="bg-red-400 hover:bg-red-500 p-[3px] rounded-full" />
            </button>
          </div>

          <label htmlFor="userImg" title="Ganti gambar profile" className="mb-5 py-1.5 px-4 mx-auto cursor-pointer">
            <span className="">Ganti Img Profil</span>
            <input type="file" aria-label="ganti user image profile" name="userImg" id="userImg" hidden accept="image/*" onChange={handleImgChange} />
          </label>

          <InputForm type="text" id="username" placeholder="username" icon={UserIcon} onChange={handleInputChange} />
          <InputForm type="tel" id="telepon" placeholder="telepon" icon={TelIcon} onChange={handleInputChange} />
          <InputForm type="text" id="alamat lengkap" placeholder="Alamat lengkap" icon={MapIcon} onChange={handleInputChange} />
          <InputForm type="text" id="rincian alamat" placeholder="Cth: Blok, No. Rumah, Patokan" icon={MapIcon} onChange={handleInputChange} />

          <button className="rounded-md mt-14 py-1.5 drop-shadow-sm ease-out duration-150 bg-slate-200 hover:bg-slate-300" type="submit" aria-label="perbarui akun" title="Perbarui akun">Perbarui Akun</button>
          <span className="block w-full py-px rounded-full mt-4 bg-slate-400/40" />
          <button onClick={handleDeleteAccount} className="w-max mx-auto mt-3 py-1 px-6 text-red-600 hover:text-red-500" type="button" aria-label="Hapus akun" title="Perbarui akun">Hapus akun</button>
        </form>
      </main>
    </>
  )
}

export default EditUserProfile