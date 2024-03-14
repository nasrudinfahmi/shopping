import { Link, useNavigate } from "react-router-dom"
import CloseIcon from '../assets/icons/x.svg'
import { useContext, useEffect, useState } from "react"
import { validateIndonesianPhoneNumber } from "../utils/utils"
import { StoreContext } from "../context/store/StoreContext"
import { useUser } from '../hooks/index'

function MyStore() {
  const { userInfo } = useUser()
  const { storeInfo, setStoreInfo } = useContext(StoreContext)
  const [errMsg, setErrMsg] = useState({})
  const [disabled, setDisabled] = useState(true)

  const navigate = useNavigate()

  const handleNextStep = () => {
    const storeValues = Object.values(storeInfo).filter(value => value && value.trim())
    if (storeValues.length === 3) {
      if (userInfo.phoneNumber) setStoreInfo({ ...storeInfo, phoneNumber: userInfo.phoneNumber })
      if (!userInfo.phoneNumber) setStoreInfo(storeInfo)
      navigate('address')
    }
  }

  useEffect(() => {
    const storeValues = Object.values(storeInfo).filter(value => value && value.trim())
    if (storeValues.length === 3) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [storeInfo, errMsg])

  function validateInput(input) {
    const regex = /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>/?]+/;
    return !regex.test(input);
  }

  const handleChange = (e) => {
    const key = e.target.id;

    setStoreInfo((prevData) => {
      const data = { ...prevData, [key]: e.target.value }
      return data;
    })

    handleInput(e)
  }

  const handleInput = (e) => {
    const key = e.target.id;
    const value = e.target.value?.trim();
    const classList = e.target.classList;
    const isValidInput = validateInput(value)
    const isValidPhoneNumber = validateIndonesianPhoneNumber(value)

    if (key === 'phoneNumber') {
      if (!isValidPhoneNumber) {
        if (classList.contains('border-green-500')) {
          classList.replace("border-green-500", "border-red-500")
        } else {
          classList.add('border-red-500')
        }

        setErrMsg((prevErrMsg) => {
          return { ...prevErrMsg, phoneNumber: "Nomor telepon tidak valid!" };
        })
      } else {
        if (classList.contains('border-red-500')) {
          classList.replace('border-red-500', 'border-green-500')
        } else {
          classList.add('border-green-500')
        }

        setErrMsg((prevErrMsg) => {
          return { ...prevErrMsg, phoneNumber: "" };
        })
      }
    }

    if (isValidInput) {
      const isValueIncludesSpace = [...value].some(val => val.trim() === "")

      if (key === 'domain') {
        if (isValueIncludesSpace) {
          setErrMsg((prevErrMsg) => {
            return { ...prevErrMsg, [key]: "Domain tidak boleh mengandung spasi!" };
          })
        } else {
          setErrMsg((prevErrMsg) => {
            return { ...prevErrMsg, [key]: null };
          })
        }
      }

      if (key !== 'phoneNumber') {
        if (value === '' || value.length < 4) {
          if (classList.contains('border-green-500')) {
            classList.replace('border-green-500', 'border-red-500')
          } else {
            classList.add('border-red-500')
          }

          const msg = 'minimal 4 karakter dan tidak terdapat simbol apapun.'
          let error;

          if (key === 'storeName') {
            error = `Nama toko ${msg}`
          }

          if (key === 'domain') {
            error = `Domain ${msg}`
          }

          setErrMsg((prevErrMsg) => {
            return { ...prevErrMsg, [key]: error };
          })
        } else {
          if (key === 'storeName') {
            if (classList.contains('border-red-500')) {
              classList.replace('border-red-500', 'border-green-500')
            } else {
              classList.add('border-green-500')
            }

            setErrMsg((prevErrMsg) => {
              return { ...prevErrMsg, [key]: null };
            })
          }

          if (key === 'domain' && !isValueIncludesSpace) {
            if (classList.contains('border-red-500')) {
              classList.replace('border-red-500', 'border-green-500')
            } else {
              classList.add('border-green-500')
            }

            setErrMsg((prevErrMsg) => {
              return { ...prevErrMsg, [key]: null };
            })
          }
        }
      }
    } else {
      if (!isValidInput && key !== "phoneNumber") {
        setErrMsg((prevErrMsg) => {
          return { ...prevErrMsg, [key]: "Tidak boleh terdapat simbol!" };
        })
      }
    }
  }

  useEffect(() => {
    if (userInfo?.phoneNumber) setStoreInfo((prevStoreInfo) => ({ ...prevStoreInfo, phoneNumber: userInfo?.phoneNumber }))
  }, [setStoreInfo, userInfo?.phoneNumber])

  useEffect(() => {
    document.getElementById('storeName').value = '';
    document.getElementById('domain').value = '';
    if (!userInfo?.phoneNumber) document.getElementById('phoneNumber').value = '';
    setStoreInfo(prevStoreData => {
      if (!userInfo?.phoneNumber) return ({})
      if (userInfo.phoneNumber) {
        const data = { ...prevStoreData }
        delete data.storeName;
        delete data.domain;
        return data;
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <header className='bg-white fixed w-full top-0 left-0 px-3 py-2 sm:py-3 shadow-navtop border-b border-slate-50 flex items-center gap-2 *:py-1 font-semibold text-lg'>
        <Link to={'/'} className="block leading-none pr-2">
          <img src={CloseIcon} alt="back icon" width={24} height={24} />
        </Link>
        <h1 className="leading-none">Buka Toko</h1>
      </header>

      <main className="w-full min-h-screen pt-20 pb-4 bg-white">
        <section className="w-full px-3">
          <h1 className="tracking-normal leading-tight text-2xl">Masukkan Info Toko</h1>

          {!userInfo?.phoneNumber && (
            <label htmlFor="phoneNumber" className="block relative mt-12">
              <input type="tel" onChange={e => handleChange(e)} required title="Nomor telepon" className="border-b outline-none peer w-full py-2 text-lg" spellCheck={false} autoComplete="off" id="phoneNumber" />
              <span title="Nomor telepon" className="absolute cursor-text text-slate-500 peer-valid:text-slate-950 peer-focus:text-slate-950 left-0 top-[8px] text-lg peer-valid:-top-[40%] peer-focus:-top-[40%] peer-focus:text-sm peer-valid:text-sm peer-focus:font-medium peer-valid:font-medium">Nomor Teleponmu</span>
            </label>
          )}
          {errMsg?.phoneNumber && <span className="text-red-500 block mt-2 text-sm leading-none">{errMsg?.phoneNumber}</span>}

          <label htmlFor="storeName" className="block relative mt-12">
            <input type="text" onChange={e => handleChange(e)} required title="nama toko" className="border-b outline-none peer w-full py-2 text-lg" spellCheck={false} autoComplete="off" id="storeName" />
            <span title="nama toko" className="absolute cursor-text text-slate-500 peer-valid:text-slate-950 peer-focus:text-slate-950 left-0 top-[8px] text-lg peer-valid:-top-[40%] peer-focus:-top-[40%] peer-focus:text-sm peer-valid:text-sm peer-focus:font-medium peer-valid:font-medium">Nama Tokomu</span>
          </label>
          {!errMsg.storeName && !storeInfo?.storeName && <span className="inline-block leading-none tracking-wide text-sm mt-3">Pilih nama yang mudah diingat<br />nama yang sudah dipilih tidak dapat diubah</span>}
          {!errMsg.storeName && storeInfo.storeName && <span className="text-sm leading-none text-green-600">Nama toko siap digunakan</span>}
          {errMsg?.storeName && <span className="text-red-500 block mt-2 text-sm leading-none">{errMsg?.storeName}</span>}

          <label htmlFor="domain" className="flex gap-2 items-center relative mt-12">
            <span className="block h-full text-lg select-none" title="domain">localhost:5173/</span>
            <input type="text" onChange={e => handleChange(e)} required title="domain" className="border-b outline-none peer w-full py-2 text-lg" spellCheck={false} autoComplete="off" id="domain" />
            <span title="domain" className="absolute cursor-text left-[130px] text-slate-500 peer-valid:text-slate-950 peer-focus:text-slate-950 leading-none top-[14px] text-lg peer-valid:-top-[40%] peer-valid:left-0 peer-focus:left-0 peer-focus:-top-[40%] peer-focus:text-sm peer-valid:text-sm peer-focus:font-medium peer-valid:font-medium">Nama Domain</span>
          </label>
          {errMsg?.domain && <span className="text-red-500 block mt-2 text-sm leading-none">{errMsg?.domain}</span>}
          {!errMsg.domain && storeInfo.domain && <span className="text-sm text-green-600 leading-none">domain tersedia</span>}
        </section>
        <div className="px-3 w-full translate-y-36">
          <button type="button" disabled={disabled} onClick={handleNextStep} title="lanjut ke proses selanjutnya" aria-label="button lanjut" className="disabled:text-black disabled:from-slate-300  disabled:to-slate-300  bg-gradient-to-br from-green-500/80 to-green-500 hover:from-green-500 hover:to-green-500 shadow-md font-medium w-full py-1 rounded-md text-white">Lanjut</button>
        </div>
      </main>
    </>
  )
}

export default MyStore