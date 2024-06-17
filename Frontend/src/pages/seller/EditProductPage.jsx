import PropTypes from 'prop-types'
import parse from 'html-react-parser'
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Toast, confirmChangeImgOpt, confirmDeleteImgOpt, deleteLabelOpt, modalInputFileOpt, modalInputOpt, promptAddLabel } from '../../lib/sweetalert2/init'
import { useEditor } from '../../hooks';
import ReactTag from '../../lib/react-tag-input/init';
import { deleteFileFromStorage, uploadFileToStorage } from '../../lib/firebase/services/storage'
import { generateRandomString } from '../../utils/utils'
import { getProduct, updateProduct } from '../../lib/firebase/services/productFirebase'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loading from '../../components/elements/Loading'

function EditProductPage() {
  const navigate = useNavigate()
  const [searchparams] = useSearchParams()
  const [data, setData] = useState()
  const { editorInstanceRef, initEditor } = useEditor()
  const [editDescription, setEditDescription] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({ isError: false, statusCode: 500 })

  const fetchGetProduct = useCallback(() => {
    setTimeout(async () => {
      try {
        const uid = searchparams.get('uid')
        if (!uid) return navigate('/dashboard/products', { replace: true })

        const productResponse = await getProduct(uid)
        setData(productResponse.data)

        window.scrollTo({ top: 0, behavior: 'instant' })
        document.getElementById('productName')?.focus()

        setLoading(false)
      } catch (error) {
        if (error.message === 'Data tidak ditemukan!') {
          setError({ isError: true, statusCode: 404 })
        } else {
          setError(prevErr => ({ ...prevErr, isError: true }))
        }
        console.log(error.message)
        setLoading(false)
      }
    }, [1100])
  }, [navigate, searchparams])

  useEffect(() => {
    fetchGetProduct()
  }, [fetchGetProduct])

  const handleTagAddition = (index, tag) => {
    const newTagInputs = [...data.tagVariations];
    newTagInputs[index].tags = [...newTagInputs[index].tags, { id: tag.id, text: tag.text }];
    setData(prevData => ({ ...prevData, tagVariations: newTagInputs }))
  };

  const handleTagDelete = (index, indexToDelete) => {
    const newTagInputs = [...data.tagVariations];
    newTagInputs[index].tags = newTagInputs[index].tags.filter((tag, i) => i !== indexToDelete);
    setData(prevData => ({ ...prevData, tagVariations: newTagInputs }))
  };

  const handleAddTagInput = async () => {
    const { value: label } = await Swal.fire(promptAddLabel)
    if (!label) return;

    const newInput = {
      id: data.tagVariations.length + 1,
      label: label,
      tags: []
    };

    setData(prevData => ({
      ...prevData,
      tagVariations: [...prevData.tagVariations, newInput]
    }))
  };

  const handleDeleteTagInput = async (label, indexToDelete) => {
    const confirmDeleteLabel = await Swal.fire(deleteLabelOpt(label))
    if (!confirmDeleteLabel.isConfirmed) return;

    const newTagInputs = data.tagVariations.filter((_input, index) => index !== indexToDelete);
    setData(prevData => ({ ...prevData, tagVariations: newTagInputs }))
  };

  useEffect(() => {
    console.log(data)
  }, [data])

  const handleClickBtn = async (e) => {
    const key = e.target.id
    let title = 'Masukkan ';
    let placeholder;
    const validNumberRegex = /^[1-9][0-9]*$/;

    if (key === 'productName') {
      title += 'Nama Produkmu'
      placeholder = 'Nama Produk'
    }
    if (key === 'price') {
      title += 'Harga Produkmu'
      placeholder = 'Harga Produk'
    }
    if (key === 'summary') {
      title += 'Ringkasan Produk'
      placeholder = 'Ringkasan Produk'
    }
    if (key === 'delivery') {
      title += 'Kota/Kab. pengiriman'
      placeholder = 'Pengiriman'
    }
    if (key === 'brand') {
      title += 'Merek Produkmu'
      placeholder = 'Merek Produk'
    }
    if (key === 'qty') {
      title += 'Stok Produkmu'
      placeholder = 'Stok Produk'
    }

    const { value } = await Swal.fire(modalInputOpt(title, placeholder))

    if (!value) return;
    if (key === 'qty') {
      const isValidNumber = validNumberRegex.test(value)

      if (!isValidNumber) {
        return Toast.fire({
          icon: 'error',
          title: 'Stok Produk Tidak Valid!'
        })
      }

      if (Number(value) > 10000) {
        return Toast.fire({
          icon: 'error',
          title: 'Maksimal 10.000 stok!'
        })
      }
    }

    setData(prevData => ({ ...prevData, [key]: value }))
  }

  const handleChangeImg = async (e) => {
    try {
      const key = e.target.id
      const classList = e.target.classList
      const classImgs = 'imgs-product'
      const classThumb = 'thumb-product'
      let options;

      const { isDenied, isDismissed } = await Swal.fire(confirmChangeImgOpt(key, classList, classImgs))

      if (isDismissed) return;
      if (isDenied) {
        const { isConfirmed } = await Swal.fire(confirmDeleteImgOpt)

        if (isConfirmed) {
          if (key === 'imgs' || classList.contains(classImgs)) {
            data.imgs.forEach(async imgUrl => {
              await deleteFileFromStorage(imgUrl)
              await updateProduct({ uid: data.uid, imgs: [] })
              setData(prevData => ({ ...prevData, imgs: [] }))
            })
            Toast.fire({ icon: 'info', title: 'Loading ...', timer: 3250 })
            setTimeout(() => {
              Toast.fire({ icon: 'success', title: 'Gambar berhasil dihapus' })
            }, [3250])
          }
        }
        return;
      }

      if (key === 'thumbProduct' || classList.contains(classThumb)) {
        options = {
          title: "Masukkan Thumbnail Produk",
          inputLabel: 'Maksimal ukuran 1MB',
          inputAttributes: {
            "accept": "image/*",
            "aria-label": "Masukkan Thumbnail Produk",
          }
        }
      }
      if (key === 'imgs' || classList.contains(classImgs)) {
        options = {
          title: "Masukkan gambar Produk",
          inputLabel: 'Maksimal 4 file dan ukuran maksimal 1MB',
          inputAttributes: {
            "accept": "image/*",
            "aria-label": "Masukkan Gambar Produk",
            "multiple": true,
          }
        }
      }

      const { value: file } = await Swal.fire(modalInputFileOpt(options));

      const isValid = checkIsImgValid({ key, classList, classImgs, file })
      if (!isValid) return;

      let imagesUrl = []
      if (key === 'imgs' || classList.contains(classImgs)) {
        setData((prevData => ({ ...prevData, imgs: [] })))

        Array.from(file).forEach(async img => {
          const randomString = generateRandomString()
          const imgName = `${randomString}-${img.name}`
          const imgUrl = await uploadFileToStorage(`products/${imgName}`, img)
          imagesUrl.push(imgUrl)
          setData((prevData => ({ ...prevData, imgs: [...prevData.imgs, imgUrl] })))
        })

        data.imgs.forEach(async img => {
          await deleteFileFromStorage(img)
        })

        Toast.fire({ icon: 'info', title: 'Loading ...', timer: 3250 })

        setTimeout(() => {
          Toast.fire({ icon: 'success', title: 'Berhasil ubah gambar' })
        }, [3300])
      }

      if (key === 'thumbProduct' || classList.contains(classThumb)) {
        const randomString = generateRandomString()
        const imgName = `${randomString}-${file.name}`
        const imgUrl = await uploadFileToStorage(`products/${imgName}`, file)

        imagesUrl = imgUrl

        setData((prevData => ({ ...prevData, thumbProduct: imgUrl })))
        Toast.fire({ icon: 'info', title: 'Loading ...', timer: 3250 })

        setTimeout(() => {
          Toast.fire({ icon: 'success', title: 'Berhasil ubah gambar' })
        }, [3300])
      }

      setTimeout(async () => {
        if (key === 'imgs' || classList.contains(classImgs)) {
          await updateProduct({ uid: data.uid, imgs: imagesUrl })
        }
        if (key === 'thumbProduct' || classList.contains(classThumb)) {
          await updateProduct({ uid: data.uid, thumbProduct: imagesUrl })
        }
      }, [3200])

    } catch (error) {
      console.log(error)
    }
  }

  const handleDescription = () => {
    if (!editDescription) {
      setEditDescription(true)
      initEditor()
    }
  }

  const handleConfirmDesc = async () => {
    const descriptionProduct = await editorInstanceRef.current.save()
    let descriptions = descriptionProduct.blocks.map((block) => {
      if (block.type === 'paragraph') {
        return {
          type: 'paragraph',
          alignment: block.tunes.textAlignment.alignment,
          text: block.data.text,
        }
      }

      if (block.type === 'list') {
        return {
          type: 'list',
          style: block.data.style,
          items: block.data.items,
        }
      }
    })

    if (descriptions.length === 0) descriptions = null

    setData(prevData => ({ ...prevData, descriptions }))

    editorInstanceRef.current = null
    setEditDescription(false)
  }

  const handleCancelDesc = () => {
    editorInstanceRef.current = null
    setEditDescription(false)
  }

  const saveChanges = async () => {
    try {
      await updateProduct(data)
      Toast.fire({
        icon: 'info',
        title: 'Loading ...',
        timer: '1100'
      })
      setTimeout(() => {
        navigate('/dashboard/products')
        Toast.fire({
          icon: 'success',
          title: 'Perubahan berhasil disimpan',
        })
      }, [1100])

    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: error.message,
      })
    }
  }

  const cancelChanges = () => {
    Toast.fire({
      icon: 'info',
      title: 'Perubahan dibatalkan'
    })

    navigate('/dashboard/products')
  }

  if (!loading && error.isError) {
    if (error.statusCode === 404) return <h1>Produk tidak ditemukan</h1>
    else return <h1>Something when wrong</h1>
  }

  if (loading) return <Loading />
  else return (
    <>
      <h1 className='text-3xl font-semibold text-slate-900'>Edit Produk</h1>

      <div className='flex items-center gap-4 mt-7 *:leading-tight'>
        <button type="button" onClick={saveChanges} className='py-1.5 px-5 outline outline-1 outline-slate-100 drop-shadow-sm rounded-md bg-white' title='Simpan Semua Perubahan' aria-label='Simpan seluruh perubahan'>
          Simpan Perubahan
        </button>

        <button type="button" onClick={cancelChanges} className='py-1.5 px-5 outline outline-1 outline-slate-100 drop-shadow-sm rounded-md bg-white' title='Batalkan Semua Perubahan' aria-label='Batalkan seluruh perubahan'>
          Batalkan Perubahan
        </button>
      </div>

      <section className="w-full flex flex-col gap-5 px-5 pt-7 pb-10 min-h-screen mt-7 rounded-2xl drop-shadow-sm bg-white">
        <BtnChangeValue label='Nama Produk' id='productName' onClick={handleClickBtn}>
          {data.productName}
        </BtnChangeValue>

        <BtnChangeValue label='Harga Produk' id='price' onClick={handleClickBtn}>
          {data.price}
        </BtnChangeValue>

        <BtnChangeValue label='Ringkasan Produk' id='summary' onClick={handleClickBtn}>
          {data.summary}
        </BtnChangeValue>

        <BtnChangeValue label='Pengiriman' id='delivery' onClick={handleClickBtn}>
          {data.delivery}
        </BtnChangeValue>

        <BtnChangeValue label='Merek Produk' id='brand' onClick={handleClickBtn}>
          {data.brand}
        </BtnChangeValue>

        <div>
          <span className="font-medium mb-1.5 block text-slate-700">Status</span>
          <div className='flex items-center gap-4'>
            <LabelStatus id='ready' data={data} setData={setData} defaultChecked={data.status === 'ready'} />
            <LabelStatus id='preorder' data={data} setData={setData} defaultChecked={data.status === 'preorder'} />
          </div>
        </div>

        {data.status === 'ready' && (
          <BtnChangeValue label='Stok Produk' id='qty' onClick={handleClickBtn}>
            {data.qty}
          </BtnChangeValue>
        )}

        <BtnChangeValue label='Thumbnail Produk' id='thumbProduct' onClick={handleChangeImg}>
          <img src={data.thumbProduct} alt="Thumbnail produk" width={64} height={64} className="thumb-product object-cover object-center aspect-video" />
        </BtnChangeValue>

        <BtnChangeValue label='Gambar Produk' id='imgs' onClick={handleChangeImg} className='flex items-center flex-wrap gap-4 sm:gap-5'>
          {data.imgs?.length > 0 && data.imgs.map((img, index) => (
            <img key={index} src={img} alt="Gambar produk" width={64} height={64} className="imgs-product object-cover object-center aspect-video" />
          ))}
          {data.imgs?.length === 0 && '-'}
        </BtnChangeValue>

        <button
          type="button"
          onClick={handleAddTagInput}
          title='Tambahkan label variasi'
          aria-label='Tambahkan label variasi'
          className='w-max mb-1 mt-2.5 outline outline-1 outline-teal-300 hover:outline-teal-400 px-5 py-1.5 rounded-md drop-shadow-sm hover:drop-shadow bg-teal-100'>
          Tambah Variasi
        </button>

        {data.tagVariations &&
          (<ReactTag
            data={data.tagVariations}
            handleTagAddition={handleTagAddition}
            handleTagDelete={handleTagDelete}
            handleDeleteTagInput={handleDeleteTagInput}
            classNameTitle="font-medium text-slate-700"
            classNameDeleteLabel="w-max mt-0 pb-1 px-4 rounded-md border-none text-red-500 hover:text-red-600"
          />)}

        <BtnChangeValue label='Deskripsi Produk' id='descriptions' onClick={handleDescription}>
          {!data.descriptions && (
            '-'
          )}
          {data.descriptions && data.descriptions.map((desc, index) => (
            <div key={index}>
              {desc.type === 'paragraph' && <p className={`${desc.alignment === 'center' ? 'text-center' : 'text-left'}`}>{parse(desc.text)}</p>}
              {desc.type === 'list' && desc.style === 'ordered' && (
                <ol className='list-decimal list-inside'>
                  {desc.items.map(item => <li key={item}>{parse(item)}</li>)}
                </ol>
              )}
              {desc.type === 'list' && desc.style === 'unordered' && (
                <ul className='list-disc list-inside'>
                  {desc.items.map(item => <li key={item}>{parse(item)}</li>)}
                </ul>
              )}
            </div>
          ))}
        </BtnChangeValue>

        {editDescription && (
          <div>
            <span className="font-medium mb-1.5 mt-4 block text-slate-700">Deskripsi Produk Baru</span>
            <div className='cdx-input rounded-md min-h-full outline-none' id='editorjs' />
            <div className='flex items-center gap-5 mt-8'>
              <button type="button" onClick={handleConfirmDesc} className='px-4 py-1.5 rounded-md drop-shadow-sm bg-emerald-100 outline outline-1 outline-emerald-300 hover:drop-shadow' title='Terapkan perubahan deskripsi' aria-label='Terapkan perubahan pada deskripsi produk'>
                Terapkan Deskripsi
              </button>
              <button type="button" onClick={handleCancelDesc} className='px-4 py-1.5 rounded-md drop-shadow-sm bg-slate-200 outline outline-1 outline-slate-300 hover:drop-shadow' title='Batalkan perubahan deskripsi' aria-label='Batalkan perubahan pada deskripsi produk'>
                Batalkan
              </button>
            </div>
          </div>
        )}

        <span className='inline-block mt-7 leading-tight bg-teal-50/20 text-slate-600 rounded'>Jangan lupa setelah melakukan perubahan klik tombol <span className='bg-slate-100'>{`'${'simpan perubahan'}'`}</span></span>
      </section>
    </>
  )
}

const BtnChangeValue = ({ label, id, className, onClick, onChange, children }) => {
  return (
    <div>
      <span className="font-medium mb-1.5 block text-slate-700">{label}</span>
      <button type="button" id={id} onClick={onClick} onChange={onChange} className={`${className} outline outline-1 outline-slate-300 hover:outline-slate-400 w-full block text-start py-1.5 px-4 rounded-md bg-white`}>
        {children || '-'}
      </button>
    </div>
  )
}

const LabelStatus = ({ id, defaultChecked, data, setData }) => {
  const qty = id === 'ready' ? 1 : 0

  return (
    <label htmlFor={id}>
      <input type="radio" name="status" id={id} className='peer' hidden defaultChecked={defaultChecked} onChange={() => { data.status = 'ready'; setData(prevData => ({ ...prevData, status: id, qty })) }} />
      <span className='peer-checked:outline-teal-500 peer-checked:bg-teal-50 peer-checked:drop-shadow block px-4 py-1.5 rounded-md outline outline-1 outline-slate-300 capitalize'>{id}</span>
    </label>
  )
}

const checkIsImgValid = ({ key, classList, classImgs, file }) => {
  const maxSize = 1 * 1024 * 1024

  if (!file) return false;

  if (file.size > maxSize) {
    Toast.fire({
      icon: 'error',
      title: 'Upload Gambar dibawah 1MB!',
    })
    return false
  }

  if (key === 'imgs' || classList.contains(classImgs)) {
    const imgs = [...file]

    if (imgs.length > 4) {
      Toast.fire({
        icon: 'error',
        title: 'Maksimal upload 4 gambar',
      })
      return false
    }

    const isBigger = imgs.some(img => img.size > maxSize)
    if (isBigger) {
      Toast.fire({
        icon: 'error',
        title: 'Upload Gambar dibawah 1MB!',
      })
      return false
    }
  }

  return true
};

BtnChangeValue.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
}

LabelStatus.propTypes = {
  id: PropTypes.string.isRequired,
  defaultChecked: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
}

export default EditProductPage