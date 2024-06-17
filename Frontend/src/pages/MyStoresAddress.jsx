import { Link, useNavigate } from "react-router-dom"
import LeftIcon from '../assets/icons/arrowLeft.svg'
import { StoreContext } from "../context/store/StoreContext"
import { useContext, useEffect } from "react"
import { useState } from 'react';
import Select from 'react-tailwindcss-select';
import { regionAxios } from "../lib/axios/init";
import { updateDataUser } from "../lib/firebase/services/userFirestore";
import { auth } from "../lib/firebase/init";
import { saveUserInfoToLocalstorage } from "../utils/utils";
import { useUser } from "../hooks";
import { Toast } from "../lib/sweetalert2/init";
import { createSeller } from "../lib/firebase/services/sellerFirestore";
import Loading from "../components/elements/Loading";

function MyStoresAddress() {
  const { userInfo, setUserInfo } = useUser()
  const { storeInfo } = useContext(StoreContext)
  const [address, setAddress] = useState({})
  const [loadingProvince, setLoadingProvince] = useState(true)
  const [provinces, setProvinces] = useState([{}])
  const [cities, setCities] = useState([{}])
  const [loadingCities, setLoadingCities] = useState(false)
  const [districts, setDistricts] = useState([{}])
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [subdistrict, setSubdistrict] = useState([{}])
  const [loadingSubdistrict, setLoadingSubdistrict] = useState(false)
  const [disabledBtn, setDisabledBtn] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const storeValues = Object.values(storeInfo).filter(value => value && value.trim())

    if (storeValues.length === 3) {
      console.log(storeInfo)
    } else {
      navigate('/mystore', { replace: true })
    }
  }, [navigate, storeInfo])

  useEffect(() => {
    const storeValues = Object.values(storeInfo).filter(value => value && value.trim())

    if (Object.keys(address).length === 4 && storeValues.length === 3) {
      setDisabledBtn(false)
    } else {
      setDisabledBtn(true)
    }
  }, [address, storeInfo])

  const handleChange = (value) => {
    if (value.key === 'province') {
      setAddress({ [value.key]: value })
    }

    if (value.key === 'city') {
      setAddress((prevAddress) => {
        const { province } = prevAddress;
        return { province, [value.key]: value }
      })
    }

    if (value.key === 'district') {
      setAddress((prevAddress) => {
        const { province, city } = prevAddress;
        return { province, city, [value.key]: value }
      })
    }

    if (value.key === 'subdistrict') {
      setAddress((prevAddress) => ({ ...prevAddress, [value?.key]: value }));
    }
  };

  const getRegion = async (path, id) => {
    try {
      const url = `${path ? path : ''}/${id}.json`
      const provinces = await regionAxios({ url })
      return provinces.data;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  useEffect(() => {
    (async function () {
      try {
        if (!address.province) {
          const provinces = await getRegion(null, 'provinces');
          setProvinces(() => {
            return provinces.map(province => ({ key: "province", value: province.id, label: province.name }))
          })
          setLoadingProvince(false)
        }

        if (address.province) {
          setLoadingCities(true)
          const cities = await getRegion("/regencies", address?.province?.value)
          setCities(() => {
            return cities.map(city => ({ key: "city", value: city.id, label: city.name }))
          })
          setLoadingCities(false)
        }

        if (address.city) {
          setLoadingDistricts(true)
          const districts = await getRegion("/districts", address?.city?.value)
          setDistricts(() => {
            return districts.map(district => ({ key: "district", value: district.id, label: district.name }))
          })
          setLoadingDistricts(false)
        }

        if (address.district) {
          setLoadingSubdistrict(true)
          const subdistrict = await getRegion("/villages", address?.district?.value)
          setSubdistrict(() => {
            return subdistrict.map(village => ({ key: "subdistrict", value: village.id, label: village.name }))
          })
          setLoadingSubdistrict(false)
        }
      } catch (error) {
        console.log(error.message)
      }
    })()
  }, [address.city, address.district, address.province])

  const handleClick = async () => {
    try {
      const { province, city, district, subdistrict } = address;
      const storeAddress = `${subdistrict.label}, ${district.label}, ${city.label}, ${province.label}, INDONESIA.`
      const datas = { ...storeInfo, address: storeAddress, email: auth.currentUser.email, }

      const sellerResponse = await createSeller(datas)

      const uids = sellerResponse.data?.uids;
      if (!userInfo.phoneNumber) {
        await updateDataUser(auth.currentUser.email, { role: "seller", uids, phoneNumber: storeInfo.phoneNumber })
      } else {
        await updateDataUser(auth.currentUser.email, { role: "seller", uids })
      }
      const user = await saveUserInfoToLocalstorage(auth.currentUser.email)
      setUserInfo(user)

      console.log(sellerResponse.data)
      Toast.fire({
        icon: "success",
        text: "Toko Anda telah resmi dibuka! Selamat berjualan ya! 🥳"
      })
    } catch (error) {
      Toast.fire({
        icon: "error",
        text: "Sepertinya ada kesalahan saat membuka toko Anda. Mari kita coba lagi dan semoga berhasil!"
      })
      console.log(error.message)
    }
  }

  return (
    <>
      <header className='bg-white fixed w-full top-0 left-0 px-3 py-2 sm:py-3 shadow-navtop border-b border-slate-50 flex items-center gap-2 *:py-1 font-semibold text-lg'>
        <Link to={-1} className="block leading-none pr-2">
          <img src={LeftIcon} alt="back icon" width={24} height={24} />
        </Link>
        <h1 className="leading-none">Buka Toko</h1>
      </header>

      <main className="w-full min-h-screen px-3 pt-20 pb-4 bg-white">
        <h1 className="tracking-normal leading-tight text-2xl">Masukkan Alamat Tokomu</h1>
        <section className="w-full mt-9 flex flex-col gap-4">
          {!loadingProvince && (
            <Select
              key="province"
              onChange={value => handleChange(value)}
              value={address.province}
              options={provinces}
              isSearchable={true}
              placeholder="provinsi"
              noOptionsMessage="Provinsi tidak ditemukan"
              loading={loadingProvince}
              searchInputPlaceholder="Cari Provinsimu"
            />
          )}

          {loadingCities && <Loading paddingTop="pt-0" />}
          {address.province && !loadingCities && (
            <Select
              key="regencies and city"
              onChange={value => handleChange(value)}
              value={address.city}
              options={cities}
              isSearchable={true}
              placeholder="kabupaten/kota"
              noOptionsMessage="Kabupaten/Kota tidak ditemukan"
              loading={loadingCities}
              searchInputPlaceholder="Cari Kotamu"
            />
          )}

          {loadingDistricts && <Loading paddingTop="pt-0" />}
          {address.city && !loadingDistricts && (
            <Select
              key="districts"
              onChange={value => handleChange(value)}
              value={address.district}
              options={districts}
              isSearchable={true}
              placeholder="Kecamatan"
              noOptionsMessage="Kecamatan tidak ditemukan"
              loading={loadingDistricts}
              searchInputPlaceholder="Cari Kecamatanmu"
            />
          )}

          {loadingSubdistrict && <Loading paddingTop="pt-0" />}
          {address.district && !loadingSubdistrict && (
            <Select
              key="subdistrict"
              onChange={value => handleChange(value)}
              value={address.subdistrict}
              options={subdistrict}
              isSearchable={true}
              placeholder="Kelurahan"
              noOptionsMessage="Kelurahan tidak ditemukan"
              loading={loadingSubdistrict}
              searchInputPlaceholder="Cari Kelurahan"
            />
          )}

          <button
            type="button"
            title="Buka Toko"
            aria-label="Buka Toko"
            disabled={disabledBtn}
            onClick={handleClick}
            className="disabled:text-slate-800 disabled:from-slate-300  disabled:to-slate-300  bg-gradient-to-br from-green-500/80 to-green-500 hover:from-green-500 hover:to-green-500 shadow-md font-medium w-full py-1 translate-y-24 rounded-md text-white"
          >
            Buka toko
          </button>
        </section>
      </main>
    </>
  )
}

export default MyStoresAddress