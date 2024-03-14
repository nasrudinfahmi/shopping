import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2800,
  timerProgressBar: true,
  customClass: { container: "z-[99999999] translate-y-7 -translate-x-7" },
});

const confirmDeleteAccount = {
  title: "Yakin ingin menghapus akunmu?",
  text: "Semua data akan hilang, jadi pastikan kamu yakin yaa!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Ya, saya yakin",
  confirmButtonAriaLabel: "Ya, saya yakin",
  focusConfirm: false,
  confirmButtonColor: "#3085d6",
  cancelButtonText: "Batal",
  cancelButtonAriaLabel: "Batal",
  cancelButtonColor: "#d33",
  focusCancel: true,
};

const modalInputPassword = {
  title: "Masukkan password sebelum menghapus akun",
  input: "password",
  inputLabel: "Password",
  inputPlaceholder: "Masukkan password kamu",
  confirmButtonText: "Hapus",
  confirmButtonAriaLabel: "Hapus akun",
  showCancelButton: true,
  cancelButtonAriaLabel: "Batal hapus akun",
  cancelButtonText: "Batalkan",
  inputValidator: (result) => !result && "Password tidak valid!",
  inputAttributes: {
    autocapitalize: "off",
    autocorrect: "off",
    arialabel: "Masukkan password sebelum menghapus akun",
    title: "password",
  },
};

export { Toast, confirmDeleteAccount, modalInputPassword };
