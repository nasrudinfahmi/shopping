import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2800,
  timerProgressBar: true,
  customClass: {
    container:
      "z-[99999999] min-[450px]:translate-y-7 min-[450px]:-translate-x-7",
  },
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

const confirmDeleteCartsProduct = {
  title: "Yakin ingin menghapus produk ini?",
  icon: "question",
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

const modalInputPasswordOpt = {
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

const promptAddLabel = {
  title: "Masukkan label variasi",
  input: "text",
  inputLabel: "contoh: ukuran, warna, bentuk, atau yang lain,",
  inputPlaceholder: "Label variasi produkmu",
  inputValidator: (value) => !value && "Label variasi tidak valid!",
  showCancelButton: true,
  cancelButtonText: "Batal",
  confirmButtonAriaLabel: "Tambah label variasi",
  cancelButtonAriaLabel: "Batal tambah label variasi",
};

const deleteLabelOpt = (label) => {
  return {
    title: `Yakin hapus label ${label}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batalkan",
    confirmButtonAriaLabel: `Hapus label ${label}.`,
    cancelButtonAriaLabel: `Batalkan hapus label ${label}.`,
  };
};

const modalInputOpt = (title, placeholder) => {
  return {
    title,
    input: "text",
    inputPlaceholder: placeholder,
    inputValidator: (value) => !value && "Data tidak valid!",
    showCancelButton: true,
    cancelButtonText: "Batal",
    confirmButtonAriaLabel: "Terapkan perubahan",
    cancelButtonAriaLabel: "Batalkan",
  };
};

const confirmChangeImgOpt = (key, classList, classImgs) => {
  return {
    title: "Yakin ingin mengubah gambar?",
    text: "Perubahan akan langsung diterapkan!",
    icon: "question",
    showCancelButton: true,
    showDenyButton:
      key === "imgs" || classList.contains(classImgs) ? true : false,
    denyButtonText: "Hapus Gambar",
    denyButtonAriaLabel: "Hapus Gambar",
    cancelButtonAriaLabel: "Batalkan",
    confirmButtonAriaLabel: "Ubah gambar produk",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#64748B",
    confirmButtonText: "Ya, ubah gambar",
    cancelButtonText: "Batalkan",
    focusCancel: true,
  };
};

const confirmDeleteImgOpt = {
  title: "Yakin ingin menghapus gambar?",
  text: "Perubahan akan langsung diterapkan!",
  icon: "warning",
  showCancelButton: true,
  cancelButtonAriaLabel: "Batalkan",
  confirmButtonAriaLabel: "Ya, hapus gambar",
  confirmButtonColor: "#FF0000",
  cancelButtonColor: "#64748B",
  confirmButtonText: "Ya, hapus gambar",
  cancelButtonText: "Batalkan",
  focusCancel: true,
};

const modalInputFileOpt = (opts = {}) => {
  return {
    input: "file",
    confirmButtonAriaLabel: "Upload Gambar",
    confirmButtonText: "Upload",
    confirmButtonColor: "#3085d6",
    showCancelButton: true,
    cancelButtonText: "Batal",
    cancelButtonAriaLabel: "Batal",
    ...opts,
  };
};

export {
  Toast,
  confirmDeleteAccount,
  confirmDeleteCartsProduct,
  modalInputPasswordOpt,
  promptAddLabel,
  deleteLabelOpt,
  modalInputOpt,
  confirmChangeImgOpt,
  confirmDeleteImgOpt,
  modalInputFileOpt,
};
