import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DetailProductPage from "./pages/DetailProductPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import CartProductPage from "./pages/CartProductPage";
import AddProductPage from "./pages/seller/AddProductPage";
import ProtectedRoute from "./components/layouts/ProtectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="product/:idProduct" element={<DetailProductPage />} />
        <Route path="cart" element={<CartProductPage />} />
      </Route>
      <Route element={<ProtectedRoute path='/auth' />}>
        <Route path="auth" element={<AuthPage />} />
      </Route>
      <Route path="dashboard/new-product" element={<AddProductPage />} />
    </>
  )
)

export default router