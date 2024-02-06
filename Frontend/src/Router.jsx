import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DetailProductPage from "./pages/DetailProductPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import CartProductPage from "./pages/CartProductPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="product/:idProduct" element={<DetailProductPage />} />
      <Route path="auth" element={<AuthPage />} />
      <Route path="cart" element={<CartProductPage />} />
    </>
  )
)

export default router