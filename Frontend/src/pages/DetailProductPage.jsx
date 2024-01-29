import PageLayout from "../components/layouts/PageLayout"
import { useRef, useState } from "react"
import DescriptionSect from '../components/fragments/sections/DescriptionSect'
import NavBottomDetailPage from "../components/fragments/navbar/NavbarBottom/NavBottomDetailPage"
import HeroSectDetailProduct from "../components/fragments/heroSect/HeroSectDetailProduct"
import DetailSect from "../components/fragments/sections/DetailSect"

function DetailProductPage() {
  const [checkedRadioBtn, setCheckedRadioBtn] = useState('')
  const [qty, setQty] = useState(1)
  const inputQtyRef = useRef()

  const handleCheckedRadio = (e) => {
    return setCheckedRadioBtn(e.target.value)
  }

  const handleInputQty = (e) => {
    const inputText = e.target.textContent;
    const numericValue = Number(inputText.replace(/[^\d]/g, ''));
    const regex = /^\d*$/;

    // Handle case when input contains non-numeric characters
    if (!regex.test(inputText)) {
      e.target.textContent = numericValue
    }

    // handle case when input is greater than 999
    if (numericValue > 999) {
      e.target.textContent = inputText.slice(0, -1)
    }

    // Handle case when input starts with 0
    if (numericValue == 0) {
      e.target.textContent = '';
    }
  }

  const handleOnBlurQty = (e) => {
    const inputText = e.target.textContent;
    const numericValue = Number(inputText.replace(/[^\d]/g, ''));

    if (!inputText || Number(inputText) == 0) {
      inputQtyRef.current.textContent = 1
      setQty(1)
    }

    setQty(numericValue)
  }

  const handleClickBtnQty = (action) => {
    if (action === 'inc') {
      setQty(prev => {
        if ((prev + 1) > 999) return 999;
        return prev + 1
      })
    } else {
      setQty(prev => {
        if ((prev - 1) < 1) return 1;
        return prev - 1
      })
    }
  }

  const valuesPropsHeroSect = { inputQtyRef, handleInputQty, checkedRadioBtn, handleCheckedRadio, handleClickBtnQty, handleOnBlurQty, qty, setQty }

  return (
    <PageLayout NavBottom={<NavBottomDetailPage />}>
      <HeroSectDetailProduct {...valuesPropsHeroSect} />

      <section className="mt-6 md:flex gap-4 items-start">
        <DescriptionSect />
        <DetailSect />
      </section>
    </PageLayout>
  )
}

export default DetailProductPage