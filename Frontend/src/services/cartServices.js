import { auth } from "../lib/firebase/init";
import {
  editQty,
  getCarts,
  toggleAllCartsStatus,
  toggleCartsStatus,
} from "../lib/firebase/services/cartFirebase";

function calculateNewQty(action, currentQty) {
  let newQty =
    action === "inc" ? parseInt(currentQty) + 1 : parseInt(currentQty) - 1;
  if (newQty < 1) newQty = 1;
  if (newQty > 50) newQty = 50;
  return newQty;
}

async function handleClickBtnQty({
  cartsData,
  setCartsData,
  action,
  idSeller,
  idCart,
}) {
  try {
    const newCart = cartsData.find((cart) => cart.uids === idSeller);
    let productToChange;
    let qty;

    const newProducts = newCart.products.map((product) => {
      if (product.idCart === idCart) {
        let quantity = calculateNewQty(action);

        productToChange = product;
        qty = quantity;

        return { ...product, qty: quantity };
      }
      return product;
    });

    setCartsData((prevCartData) => {
      return prevCartData.map((cart) => {
        if (cart.uids === idSeller) {
          return { ...cart, products: newProducts };
        }
        return cart;
      });
    });

    await editQty({
      email: auth?.currentUser?.email,
      qty,
      idCart: productToChange.idCart,
      uids: productToChange.uids,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function fetchCartData({
  email,
  setCartsData,
  setCheckedAll,
  setProductsReadyToCheckout,
  setLoading,
}) {
  try {
    const cartResponse = await getCarts(email);
    setCartsData(cartResponse.data.carts);
    setCheckedAll(cartResponse.data.checkedAll);

    const productsReady = cartResponse.data.carts
      .map((cart) => {
        const products = cart.products.filter((product) => product.isReady);
        if (products.length !== 0)
          return { ...cart, totalProducts: products.length, products };
      })
      ?.filter((cart) => cart);

    const prices = productsReady
      .map((cart) => {
        return cart.products.map((product) => product.price * product.qty);
      })
      .flat();

    setProductsReadyToCheckout((prev) => {
      return {
        ...prev,
        products: productsReady,
        totalproducts: prices.length,
        totalPrice:
          prices.length === 0
            ? 0
            : prices.reduce((acc, curr) => Number(acc) + Number(curr)),
      };
    });

    setLoading(false);
  } catch (error) {
    setLoading(false);
    throw new Error(error.message);
  }
}

async function toggleCheck({
  idCart,
  idSeller,
  cartsData,
  setCartsData,
  setCheckedAll,
  setProductsReadyToCheckout,
}) {
  try {
    const newCart = cartsData.find((cart) => cart.uids === idSeller);
    const newProducts = newCart.products.map((product) => {
      if (product.idCart === idCart) {
        const status = product.isReady;
        return { ...product, isReady: status };
      }
      return product;
    });

    setCartsData((prevCartData) => {
      return prevCartData.map((cart) => {
        if (cart.uids === idSeller) {
          return { ...cart, products: newProducts };
        }
        return cart;
      });
    });

    const IsProductChekedAll = cartsData
      .map((cart) => {
        return cart.products.every((product) => product.isReady === true);
      })
      .every((status) => status === true);
    setCheckedAll(IsProductChekedAll);

    const productsReady = cartsData
      .map((cart) => {
        const products = cart.products.filter((product) => product.isReady);
        if (products.length !== 0)
          return { ...cart, totalProducts: products.length, products };
      })
      ?.filter((cart) => cart);

    const prices = productsReady
      .map((cart) => {
        return cart.products.map((product) => product.price * product.qty);
      })
      .flat();

    setProductsReadyToCheckout((prev) => {
      return {
        ...prev,
        products: productsReady,
        totalproducts: prices.length,
        totalPrice:
          prices.length === 0
            ? 0
            : prices.reduce((acc, curr) => Number(acc) + Number(curr)),
      };
    });

    await toggleCartsStatus({
      email: auth?.currentUser?.email,
      uids: idSeller,
      idCart,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function toggleCheckAll({
  setCartsData,
  setCheckedAll,
  setProductsReadyToCheckout,
}) {
  try {
    const toggleCartsResponse = await toggleAllCartsStatus(
      auth?.currentUser?.email
    );
    setCheckedAll(toggleCartsResponse.data.checkedAll);
    setCartsData(toggleCartsResponse.data.carts);

    const productsReady = toggleCartsResponse.data.carts
      .map((cart) => {
        const products = cart.products.filter((product) => product.isReady);
        if (products.length !== 0)
          return { ...cart, totalProducts: products.length, products };
      })
      ?.filter((cart) => cart);

    const prices = productsReady
      .map((cart) => {
        return cart.products.map((product) => product.price * product.qty);
      })
      .flat();

    setProductsReadyToCheckout((prev) => {
      return {
        ...prev,
        products: productsReady,
        totalproducts: prices.length,
        totalPrice:
          prices.length === 0
            ? 0
            : prices.reduce((acc, curr) => Number(acc) + Number(curr)),
      };
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export {
  handleClickBtnQty,
  fetchCartData,
  toggleCheck,
  toggleCheckAll,
  calculateNewQty,
};
