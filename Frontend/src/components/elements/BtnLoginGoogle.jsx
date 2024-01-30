import GoogleIcon from '../../assets/icons/google.svg'

function BtnLoginGoogle() {
  return (
    <button type="button" aria-label='masuk dengan akun google' className='border flex gap-2 mt-5 py-1 items-center justify-center rounded-full'>
      <img src={GoogleIcon} alt="ikon google" width={21} height={21} />
      Masuk dengan google
    </button>
  )
}

export default BtnLoginGoogle