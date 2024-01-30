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

const NAVBAR_BOTTOM = [
  { label: "Beranda", alt: "Ikon beranda", src: HomeIcon },
  { label: "Rekomendasi", alt: "Ikon rekomendasi", src: RecomIcon },
  { label: "Siaran langsung", alt: "Ikon siaran langsung", src: LiveIcon },
  { label: "Profil saya", alt: "Ikon profil", src: UserIcon },
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

export { NAVBAR_BOTTOM, CATEGORIES_HOME, AUTH_FORM_CONSTANTS };
