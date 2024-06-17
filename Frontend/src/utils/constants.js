import HomeIcon from "../assets/icons/home.svg";
import RecomIcon from "../assets/icons/recommendation.svg";
import LiveIcon from "../assets/icons/live.svg";
import UserIcon from "../assets/icons/user.svg";

import LaptopImg from "../assets/categories/tech.webp";
import BooksImg from "../assets/categories/books.webp";
import LivingImg from "../assets/categories/livingroom.webp";
import ManFashionImg from "../assets/categories/man-fashion.webp";
import WomenFashionImg from "../assets/categories/women-fashion.webp";
import kitchenImg from "../assets/categories/kitchen.webp";

import EmailIcon from "../assets/icons/email.svg";
import PadlockIcon from "../assets/icons/padlock.svg";
import TelIcon from "../assets/icons/telIcon.svg";

import DashboardIcon from "../assets/icons/Dashboard.svg";
import ProductIcon from "../assets/icons/basket.svg";
import UserIcon2 from "../assets/icons/user2.svg";
import MailIcon from "../assets/icons/mail2.svg";
import NotifIcon2 from "../assets/icons/notification2.svg";
import SettingIcon from "../assets/icons/setting.svg";
import LogoutIcon from "../assets/icons/logout.svg";

import BookIcon from "../assets/icons/book.svg";
import CartIcon from "../assets/icons/cart.svg";
import StarIcon from "../assets/icons/star.svg";
import ChatIcon from "../assets/icons/chat.svg";
import NotifIcon from "../assets/icons/notification.svg";
import HeadsetIcon from "../assets/icons/headset.svg";
import HelpIcon from "../assets/icons/help.svg";

const NAVBAR_BOTTOM = [
  { label: "Beranda", alt: "Ikon beranda", src: HomeIcon, href: "/" },
  { label: "Rekomendasi", alt: "Ikon rekomendasi", src: RecomIcon, href: "" },
  {
    label: "Siaran langsung",
    alt: "Ikon siaran langsung",
    src: LiveIcon,
    href: "",
  },
  { label: "Profil saya", alt: "Ikon profil", src: UserIcon, href: "/me" },
];

const CATEGORIES_HOME = [
  { src: LaptopImg, title: "Laptop", to: "" },
  { src: BooksImg, title: "Buku", to: "" },
  { src: LivingImg, title: "Furnitur", to: "" },
  { src: ManFashionImg, title: "Fasion Pria", to: "" },
  { src: WomenFashionImg, title: "Fasion Wanita", to: "" },
  { src: kitchenImg, title: "Dapur", to: "" },
];

const AUTH_FORM_CONSTANTS = {
  LOGIN: [
    { icon: EmailIcon, id: "email", type: "email", placeholder: "email" },
    {
      icon: PadlockIcon,
      id: "password",
      type: "password",
      placeholder: "********",
    },
  ],
  REGISTER: [
    { icon: UserIcon, id: "username", type: "text", placeholder: "username" },
    { icon: EmailIcon, id: "email", type: "email", placeholder: "email" },
    {
      icon: TelIcon,
      id: "telepon",
      type: "text",
      placeholder: "+628123456789",
    },
    {
      icon: PadlockIcon,
      id: "password",
      type: "password",
      placeholder: "********",
    },
    {
      icon: PadlockIcon,
      id: "confPassword",
      type: "password",
      placeholder: "********",
    },
  ],
};

let DATA_DUMMY_CARTS = {
  userId123: {
    totalCart: 4,
    carts: [
      {
        idSeller: "111",
        sellerName: "Toko makmur",
        products: [
          {
            idProduct: "b1",
            productName: "Baju bagus sekali",
            imgThumb: ManFashionImg,
            qty: 5,
            price: 1000,
            totalPrice: 5000,
            variasi: "merah, xl",
            isChecked: false,
          },
          {
            idProduct: "b2",
            productName: "jaket bagus",
            imgThumb: ManFashionImg,
            qty: 10,
            price: 2000,
            totalPrice: 20000,
            variasi: "green forest, xl",
            isChecked: true,
          },
          {
            idProduct: "b3",
            productName: "kaos oblong",
            imgThumb: ManFashionImg,
            qty: 2,
            price: 1000,
            totalPrice: 2000,
            variasi: "green forest, xl",
            isChecked: true,
          },
        ],
      },
      {
        idSeller: "222",
        sellerName: "Toko abadi jaya",
        products: [
          {
            idProduct: "c1",
            productName: "Celana kolor",
            imgThumb: ManFashionImg,
            qty: 1,
            price: 110000,
            totalPrice: 110000,
            variasi: "abu tua, xl",
            isChecked: true,
          },
          {
            idProduct: "c2",
            productName: "celana jeans",
            imgThumb: ManFashionImg,
            qty: 3,
            price: 330000,
            totalPrice: 330000,
            variasi: "hitam, 33",
            isChecked: true,
          },
        ],
      },
    ],
  },
};

const MENUS_ADMIN_SIDEBAR = [
  {
    icon: DashboardIcon,
    alt: "ikon dashboard",
    text: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: ProductIcon,
    alt: "ikon produk",
    text: "Produk",
    href: "/dashboard/products",
  },
  { icon: UserIcon2, alt: "ikon user", text: "Profil", href: "/dashboard" },
  { icon: MailIcon, alt: "ikon pesan", text: "Pesan", href: "/dashboard" },
  {
    icon: NotifIcon2,
    alt: "ikon notifikasi",
    text: "Notifikasi",
    href: "/dashboard",
  },
  {
    icon: SettingIcon,
    alt: "ikon pengaturan",
    text: "Pengaturan",
    href: "/dashboard",
  },
  { icon: LogoutIcon, alt: "ikon keluar", text: "Keluar", href: "/dashboard" },
];

const FIREBASE_ERROR = [
  {
    error: "Firebase: Error (auth/email-already-in-use).",
    message: "Email sudah terdaftar!",
  },
  {
    error: "Firebase: Error (auth/invalid-login-credentials).",
    message: "Email atau password salah!",
  },
];

const MENUS_USER_PROFILE = {
  FIRST: [
    {
      icon: BookIcon,
      text: "Daftar Transaksi",
      path: "",
    },
    {
      icon: CartIcon,
      text: "Keranjang Belanja",
      path: "/cart",
    },
    {
      icon: StarIcon,
      text: "Ulasan",
      path: "",
    },
    {
      icon: ChatIcon,
      text: "Pesan",
      path: "",
    },
    {
      icon: NotifIcon,
      text: "Notifikasi",
      path: "",
    },
  ],
  TWO: [
    {
      icon: HeadsetIcon,
      text: "Customer Service",
      path: "",
    },
    {
      icon: HelpIcon,
      text: "Pusat Bantuan",
      path: "",
    },
  ],
};

export {
  NAVBAR_BOTTOM,
  CATEGORIES_HOME,
  AUTH_FORM_CONSTANTS,
  DATA_DUMMY_CARTS,
  MENUS_ADMIN_SIDEBAR,
  FIREBASE_ERROR,
  MENUS_USER_PROFILE,
};
