import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DetailProductPage from "./pages/DetailProductPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import CartProductPage from "./pages/CartProductPage";
import AddProductPage from "./pages/seller/AddProductPage";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import EditUserProfile from "./pages/EditUserProfile";
import UsersProfile from "./pages/UsersProfile";
import MyStore from "./pages/MyStore";
import MyStoresAddress from "./pages/MyStoresAddress";
import ProtectedRoute2 from "./components/layouts/ProtectedRoute2";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="me" element={<UsersProfile />} />
      <Route element={<ProtectedRoute />}>
        <Route path="product/:idProduct" element={<DetailProductPage />} />
        <Route path="cart" element={<CartProductPage />} />
        <Route path="me/editprofile" element={<EditUserProfile />} />
      </Route>
      <Route element={<ProtectedRoute path='/auth' />}>
        <Route path="auth" element={<AuthPage />} />
      </Route>
      <Route element={<ProtectedRoute path="/mystore" />}>
        <Route path="mystore" element={<MyStore />} />
        <Route path="mystore/address" element={<MyStoresAddress />} />
      </Route>
      <Route element={<ProtectedRoute2 />}>
        <Route path="dashboard/new-product" element={<AddProductPage />} />
      </Route>
    </>
  )
)
// Firebase: Error (auth/requires-recent-login).
export default router