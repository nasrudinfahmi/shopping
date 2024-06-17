import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, useUser } from '../../hooks/index'
import InputForm from '../../components/elements/InputForm'
import RadioBtn from '../../components/elements/RadioBtn'
import RichTextEditor from '../../components/elements/RichTextEditor'
import { generateRandomString, getValueById } from '../../utils/utils'
import Swal from 'sweetalert2'
import { WithContext as ReactTags } from 'react-tag-input';
import { uploadFileToStorage } from '../../lib/firebase/services/storage'
import { addNewProduct } from '../../lib/firebase/services/productFirebase'
import { Toast } from '../../lib/sweetalert2/init'
import BtnSubmit from '../../components/elements/BtnSubmit'
import { useNavigate } from 'react-router-dom'

function AddProductPage() {
  const { userInfo } = useUser()
  const [isSidebarActive, setSidebarActive] = useState(false)
  const [statusProduct, setStatusProduct] = useState('ready')
  const { editorInstanceRef, initEditor } = useEditor()
  const editorRef = useRef(null)
  const [imgsProduct, setImgsProduct] = useState([])
  const [thumbImg, setThumbImg] = useState({})
  const [tagInputs, setTagInputs] = useState([]);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleTagAddition = (index, tag) => {
    const newTagInputs = [...tagInputs];
    newTagInputs[index].tags = [...newTagInputs[index].tags, { id: tag.id, text: tag.text }];
    setTagInputs(newTagInputs);
  };

  const handleTagDelete = (index, indexToDelete) => {
    const newTagInputs = [...tagInputs];
    newTagInputs[index].tags = newTagInputs[index].tags.filter((tag, i) => i !== indexToDelete);
    setTagInputs(newTagInputs);
  };

  const handleAddTagInput = async () => {
    const { value: label } = await Swal.fire({
      title: "Masukkan label variasi",
      input: 'text',
      inputLabel: "contoh: ukuran, warna, bentuk, atau yang lain,",
      inputPlaceholder: "Label variasi produkmu",
      inputValidator: value => !value && "Label variasi tidak valid!",
      showCancelButton: true,
      cancelButtonText: "Batal",
      cancelButtonAriaLabel: "Batal",
    })
    if (!label) return;

    const newInput = {
      id: tagInputs.length + 1,
      label: label,
      tags: []
    };
    setTagInputs([...tagInputs, newInput]);
  };

  const handleDeleteTagInput = async (label, indexToDelete) => {
    const confirmDeleteLabel = await Swal.fire({
      title: `Yakin hapus label ${label}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: 'Batalkan',
      confirmButtonAriaLabel: `Hapus label ${label}.`,
      cancelButtonAriaLabel: `Batalkan hapus label ${label}.`
    })
    if (!confirmDeleteLabel.isConfirmed) return;

    const newTagInputs = tagInputs.filter((_input, index) => index !== indexToDelete);
    setTagInputs(newTagInputs);
  };

  const KeyCodes = {
    comma: 188,
    enter: 13
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  useEffect(() => {
    if (!editorRef.current) {
      initEditor()
      editorRef.current = true
    }
  }, [editorInstanceRef, initEditor])

  const sidebarRef = useRef()
  const btnTriggerRef = useRef()

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
      setLoading(true)
      const uids = userInfo.uids
      const productName = getValueById('nama produk')
      const price = getValueById('harga')
      const summary = getValueById('ringkasan')
      const delivery = getValueById('pengiriman')
      const brand = getValueById('merek')
      const qty = getValueById('kuantitas')
      const radios = Array.from(document.querySelectorAll('[name="detail"]')).find(radio => radio.checked ? radio : null)?.value
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

      let imgs = [];
      Array.from(imgsProduct).forEach(async (img) => {
        const randomString2 = generateRandomString();
        const pathImgUrl = `products/${randomString2}-${img.name}`
        const imgUrl = await uploadFileToStorage(pathImgUrl, img)
        imgs.push(imgUrl)
      })

      const randomString1 = Math.random().toString(36).substring(2);
      const pathUrlThumbProduct = `products/${randomString1}-${thumbImg.name}`
      const thumbProductUrl = await uploadFileToStorage(pathUrlThumbProduct, thumbImg)

      let datas = {
        uids,
        productName,
        price: Number(price),
        summary,
        delivery,
        brand,
        status: radios,
        qty: Number(qty),
        thumbProduct: thumbProductUrl,
        imgs,
        tagVariations: tagInputs,
        descriptions,
      };

      setTimeout(async () => {
        console.log(imgs)
        console.log(datas)
        await addNewProduct(datas)

        Toast.fire({
          icon: 'success',
          title: 'Berhasil menambahkan produk baru.'
        })

        setLoading(false)
        navigate('/dashboard/products')
      }, 1800);

    } catch (error) {
      setLoading(false)
      console.log(error);
      Toast.fire({
        icon: 'error',
        title: error.message,
      })
    }
  }

  const filterImgProduct = (e) => {
    const files = e.target.files;
    const maxSize = 1 * 1024 * 1024

    if (e.target.id === 'gambar produk') {
      if (files.length > 4) {
        alert('Maksimal upload 4 image!')
        return e.target.value = '';
      }
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        alert("Maksimal ukuran gambar 1MB!");
        return e.target.value = '';
      }
    }
  };

  const handleChangeInputFile = (e) => {
    const files = e.target.files;
    filterImgProduct(e)

    if (e.target.id === 'thumbnail produk') {
      setThumbImg(files[0])
    }

    if (e.target.id === 'gambar produk') {
      setImgsProduct(files)
    }
  }

  return (
    <>
      <h1 className='text-3xl font-semibold text-slate-900'>produk baru</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-2 px-3 sm:px-8 lg:px-10 pt-4 pb-8 sm:pb-10 mt-7 bg-white rounded-lg drop-shadow-sm'>
        <InputForm id='nama produk' placeholder='nama produk' type='text' required={true} />
        <InputForm id='harga' placeholder='harga produk' type='number' required={true} />
        <InputForm id='ringkasan' placeholder='ringkasan produk' type='text' optional={true} />
        <InputForm id='pengiriman' placeholder='pengiriman' type='text' required={true} />
        <InputForm id='merek' placeholder='merek produk' type='text' required={true} />
        <span className='mb-px mt-2 pl-px text-sm font-semibold text-slate-700'>status produk</span>
        <div className='flex gap-2 items-center'>
          <RadioBtn checkedRadioBtn={statusProduct} handleCheckedRadio={(e) => setStatusProduct(e.target.value)} detail='ready' />
          <RadioBtn checkedRadioBtn={statusProduct} handleCheckedRadio={(e) => setStatusProduct(e.target.value)} detail='preorder' />
        </div>
        {statusProduct === 'ready' && <InputForm id='kuantitas' placeholder='kuantitas produk' type='number' required={true} />}
        <InputForm type='file' id='thumbnail produk' placeholder='thumbnail produk' required={true} accept='image/*' onChange={e => handleChangeInputFile(e)} />
        <InputForm type='file' id='gambar produk' placeholder='gambar produk' multiple={true} accept='image/*' onChange={e => handleChangeInputFile(e)} />

        <button type="button" title='Tambah label variasi' onClick={handleAddTagInput} aria-label='tambah label variasi produk' className='w-max px-4 py-1 mb-3 mt-6 rounded-md border-none bg-teal-200 shadow-sm hover:shadow duration-75'>Tambah variasi</button>

        {tagInputs.map((input, index) => (
          <div key={`input-tag-${input.id}`}>
            <span className='mb-px mt-2 pl-px text-sm font-semibold text-slate-700'>{input.label}</span>
            <button type="button" title={`Hapus label variasi ${input.label}`} onClick={() => handleDeleteTagInput(input.label, index)} aria-label='Hapus label variasi' className='w-max mt-0 pb-1 px-4 rounded-md border-none text-red-500 hover:text-red-600'>Hapus label {input.label}</button>
            <ReactTags
              tags={input.tags}
              placeholder="Tulis tag produkmu, lalu tekan enter"
              classNames={{
                tags: 'flex flex-col gap-3',
                tagInput: 'border rounded',
                tagInputField: 'w-full border-none outline-none py-1 px-3 rounded',
                tag: 'border bg-slate-100 shadow-sm pl-4 pb-[5px] rounded-md',
                remove: 'px-4 text-xl text-red-600 hover:text-red-500 hover:font-bold',
                selected: 'flex items-center justify-start flex-wrap gap-x-4 gap-y-2 mb-4'
              }}
              name='variasi produk'
              delimiters={delimiters}
              handleAddition={(tag) => handleTagAddition(index, tag)}
              handleDelete={(indexToDelete) => handleTagDelete(index, indexToDelete)}
              allowDragDrop={false}
              inputFieldPosition='top'
              inputProps={{
                title: `label ${input.label}`,
                "aria-label": `label ${input.label}`,
                name: `label ${input.label}`,
              }}
              autocomplete
            />
          </div>
        ))}

        <RichTextEditor />
        <BtnSubmit isLoading={loading} className="mt-10 bg-slate-100 hover:bg-slate-200 rounded-md drop-shadow-sm">
          Tambah Produk
        </BtnSubmit>
      </form>
    </>
  )
}

export default AddProductPage