import { addCart, cartsSnapshot } from "../services/cartService.js";
import { getProduct } from "../services/productServices.js";
import { errorResponse, successResponse } from "../utils/utils.js";

const getUserCartController = async (req, res) => {
  try {
    const { email } = req.query;

    // Validasi email
    if (!email?.trim()) {
      throw new Error("Data tidak valid!");
    }

    // Dapatkan keranjang belanja pengguna
    const usersCartSnapShot = await cartsSnapshot(email);

    // Cek apakah keranjang belanja kosong
    if (usersCartSnapShot.empty) {
      throw new Error("Keranjang belanja kosong!");
    }

    // Ambil data keranjang pengguna
    const usersCarts = usersCartSnapShot.docs[0].data();
    let totalCarts = 0;

    // Hitung total produk di setiap keranjang
    usersCarts.carts.forEach((cart) => {
      totalCarts += cart.products.length;
    });

    // Dapatkan detail produk untuk setiap item dalam keranjang
    const cartsData = await Promise.all(
      usersCarts.carts.map(async (cart) => {
        const products = await Promise.all(
          cart.products.map(async (item) => {
            const uidProduct = item.uid;
            const product = await getProduct(uidProduct);
            const dataProduct = {
              ...item,
              productName: product.productName,
              price: product.price,
              imgThumb: product.thumbProduct,
              uids: product.uids,
              status: product.status,
              stock: product.qty,
            };
            return dataProduct;
          })
        );
        return { ...cart, totalProducts: products.length, products };
      })
    );

    let IsProductChekedAll = cartsData
      .map((cart) => {
        return cart.products.every((product) => product.isReady === true);
      })
      .every((status) => status === true);

    // Siapkan data keranjang belanja pengguna
    const usersCartsData = {
      email,
      totalCarts,
      checkedAll: cartsData.length === 0 ? false : IsProductChekedAll,
      carts: cartsData,
    };

    // Respon sukses
    return successResponse(
      res,
      200,
      "Berhasil mendapatkan keranjang belanja user",
      { data: usersCartsData }
    );
  } catch (error) {
    console.log(error);
    // Tangani kesalahan
    let statusCode = 500;
    if (error.message === "Data tidak valid!") statusCode = 400;
    if (error.message === "Keranjang belanja kosong!") statusCode = 404;

    // Respon dengan kesalahan
    if (statusCode === 404) {
      return successResponse(res, statusCode, error.message, {
        data: { email: req.query.email, totalCart: 0, carts: [] },
      });
    }

    return errorResponse(res, statusCode, error.message);
  }
};

const addCartController = async (req, res) => {
  try {
    let { email, qty, variations, uid, uids, storeName } = req.body;

    if (
      !email?.trim() ||
      !qty ||
      !String(variations)?.trim() ||
      !uid?.trim() ||
      !uids?.trim() ||
      !storeName?.trim()
    ) {
      throw new Error("Data tidak valid!");
    }

    if (JSON.stringify(variations) === "{}") {
      variations = { variations: "default" };
    }

    const datas = { email, qty: Number(qty), variations, uid, uids, storeName };
    await addCart(datas);

    return successResponse(res, 201, "Berhasil menambahkan keranjang belanja");
  } catch (error) {
    let statusCode = 500;

    if (error.message === "Data tidak valid!") statusCode = 400;

    return errorResponse(res, statusCode, error.message);
  }
};

const deleteCartByUidsController = async (req, res) => {
  try {
    const { email, uids } = req.body;
    if (!email?.trim() || !uids?.trim()) throw new Error("Data tidak valid!");

    const usersCartSnapshot = await cartsSnapshot(email);

    if (usersCartSnapshot.empty) {
      throw new Error("Keranjang belanja kosong!");
    }

    let usersCarts = usersCartSnapshot.docs[0].data();

    const carts = usersCarts.carts.filter((cart) => {
      return cart.uids !== uids;
    });

    usersCartSnapshot.docs[0].ref.update({ carts });

    return successResponse(res, 200, "Berhasil menghapus keranjang belanja");
  } catch (error) {
    let statusCode = 500;

    if (
      error.message === "Data tidak valid!" ||
      error.message === "Keranjang belanja kosong!"
    ) {
      statusCode = 400;
    }

    return errorResponse(res, statusCode, error.message);
  }
};

const deleteProductsCartController = async (req, res) => {
  try {
    const { email, uids, idCart } = req.body;

    if (!email?.trim() || !uids?.trim() || !idCart?.trim()) {
      throw new Error("Data tidak valid!");
    }

    const usersCartSnapshot = await cartsSnapshot(email);

    if (usersCartSnapshot.empty) {
      throw new Error("Keranjang belanja kosong!");
    }

    const usersCarts = usersCartSnapshot.docs[0].data();
    let carts = usersCarts.carts;

    const existingCart = carts.find((cart) => {
      return cart.uids === uids;
    });

    if (!existingCart) {
      throw new Error("Produk tidak ada di keranjang belanja!");
    }

    const filteredProducts = existingCart.products.filter((item) => {
      return item.idCart !== idCart;
    });

    if (filteredProducts.length !== 0) {
      carts = carts.map((cart) => {
        if (cart.uids === uids) {
          return { ...cart, products: filteredProducts };
        }
        return cart;
      });
    } else {
      carts = carts.filter((cart) => {
        return cart.uids !== uids;
      });
    }

    if (carts.length === 0) carts = [];

    usersCartSnapshot.docs[0].ref.update({ carts });

    return successResponse(res, 200, "Berhasil menghapus produk");
  } catch (error) {
    let statusCode = 500;
    console.log(error);
    if (
      error.message === "Data tidak valid!" ||
      error.message === "Produk tidak ada di keranjang belanja!"
    ) {
      statusCode = 400;
    }

    return errorResponse(res, statusCode, error.message);
  }
};

const deleteManyProductsCartController = async (req, res) => {
  try {
    const { email, products } = req.body;
    if (!email?.trim() || !products) throw new Error("Data tidak valid!");

    const usersCartSnapshot = await cartsSnapshot(email);

    if (usersCartSnapshot.empty) {
      throw new Error("Keranjang belanja kosong!");
    }

    const usersCarts = usersCartSnapshot.docs[0].data();
    let carts = usersCarts.carts;

    products.forEach((product) => {
      const existingCart = carts.find((cart) => {
        return cart.uids === product.uids;
      });

      if (!existingCart) {
        throw new Error("Produk tidak ada di keranjang belanja!");
      }

      const filteredProducts = existingCart.products.filter((item) => {
        return item.idCart !== product.idCart;
      });

      if (filteredProducts.length !== 0) {
        console.log("masuk filter");
        carts = carts.map((cart) => {
          if (cart.uids === product.uids) {
            return { ...cart, products: filteredProducts };
          }
          return cart;
        });
      } else {
        console.log("masuk hapus");
        carts = carts.filter((cart) => {
          return cart.uids !== product.uids;
        });
      }
    });

    if (carts.length === 0) carts = [];
    usersCartSnapshot.docs[0].ref.update({ carts });

    return successResponse(res, 200, "Berhasil menghapus produk");
  } catch (error) {
    let statusCode = 500;

    if (
      error.message === "Data tidak valid!" ||
      error.message === "Produk tidak ada di keranjang belanja!"
    ) {
      statusCode = 400;
    }

    return errorResponse(res, statusCode, error.message);
  }
};

const toggleCartsStatusController = async (req, res) => {
  try {
    const { email, uids, idCart } = req.body;

    if (!email?.trim() || !uids?.trim() || !idCart?.trim()) {
      throw new Error("Data tidak valid!");
    }

    const usersCartSnapshot = await cartsSnapshot(email);

    if (usersCartSnapshot.empty) {
      throw new Error("Keranjang belanja kosong!");
    }

    const usersCarts = usersCartSnapshot.docs[0].data();
    let carts = usersCarts.carts;

    const existingCart = carts.find((cart) => {
      return cart.uids === uids;
    });

    if (!existingCart) {
      throw new Error("Produk tidak ada di keranjang belanja!");
    }

    const products = existingCart.products.map((item) => {
      if (item.idCart === idCart) {
        return { ...item, isReady: !item.isReady };
      }
      return item;
    });

    carts = carts.map((cart) => {
      if (cart.uids === uids) {
        return { ...cart, products };
      }
      return cart;
    });

    usersCartSnapshot.docs[0].ref.update({ carts });

    return successResponse(
      res,
      200,
      "Berhasil merubah status keranjang belanja"
    );
  } catch (error) {
    let statusCode = 500;

    if (
      error.message === "Data tidak valid!" ||
      error.message === "Produk tidak ada di keranjang belanja!"
    ) {
      statusCode = 400;
    }

    return errorResponse(res, statusCode, error.message);
  }
};

const editCartsQtyController = async (req, res) => {
  try {
    const { email, uids, idCart, qty } = req.body;

    if (!email?.trim() || !uids?.trim() || !idCart?.trim() || !qty) {
      throw new Error("Data tidak valid!");
    }

    const usersCartSnapshot = await cartsSnapshot(email);

    if (usersCartSnapshot.empty) {
      throw new Error("Keranjang belanja kosong!");
    }

    const usersCarts = usersCartSnapshot.docs[0].data();
    let carts = usersCarts.carts;

    const existingCart = carts.find((cart) => {
      return cart.uids === uids;
    });

    if (!existingCart) {
      throw new Error("Produk tidak ada di keranjang belanja!");
    }

    const products = existingCart.products.map((item) => {
      if (item.idCart === idCart) {
        return { ...item, qty: parseInt(qty) };
      }
      return item;
    });

    carts = carts.map((cart) => {
      if (cart.uids === uids) {
        return { ...cart, products };
      }
      return cart;
    });

    usersCartSnapshot.docs[0].ref.update({ carts });

    return successResponse(
      res,
      200,
      "Berhasil merubah kuantitas keranjang produk"
    );
  } catch (error) {
    let statusCode = 500;

    if (
      error.message === "Data tidak valid!" ||
      error.message === "Produk tidak ada di keranjang belanja!"
    ) {
      statusCode = 400;
    }

    return errorResponse(res, statusCode, error.message);
  }
};

const toggleAllCartsStatusController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      throw new Error("Data tidak valid!");
    }

    const usersCartSnapshot = await cartsSnapshot(email);

    if (usersCartSnapshot.empty) {
      throw new Error("Keranjang belanja kosong!");
    }

    const usersCarts = usersCartSnapshot.docs[0].data();
    let carts = usersCarts.carts;

    const areAllProductsReady = carts
      .map((cart) => {
        const status = cart.products.every(
          (product) => product.isReady === true
        );
        return status;
      })
      .every((status) => status === true);

    console.log(areAllProductsReady);

    if (areAllProductsReady) {
      carts = carts.map((cart) => {
        return {
          ...cart,
          products: cart.products.map((product) => ({
            ...product,
            isReady: false,
          })),
        };
      });
    } else {
      carts = carts.map((cart) => {
        return {
          ...cart,
          products: cart.products.map((product) => ({
            ...product,
            isReady: true,
          })),
        };
      });
    }

    usersCartSnapshot.docs[0].ref.update({ carts });

    // Hitung total produk di setiap keranjang
    let totalCarts = 0;
    usersCarts.carts.forEach((cart) => {
      totalCarts += cart.products.length;
    });

    // Dapatkan detail produk untuk setiap item dalam keranjang
    const cartsData = await Promise.all(
      carts.map(async (cart) => {
        const products = await Promise.all(
          cart.products.map(async (item) => {
            const uidProduct = item.uid;
            const product = await getProduct(uidProduct);
            const dataProduct = {
              ...item,
              productName: product.productName,
              price: product.price,
              imgThumb: product.thumbProduct,
              uids: product.uids,
              status: product.status,
              stock: product.qty,
            };
            return dataProduct;
          })
        );
        return { ...cart, totalProducts: products.length, products };
      })
    );

    // Siapkan data keranjang belanja pengguna
    const usersCartsData = {
      email,
      totalCarts,
      checkedAll: !areAllProductsReady,
      carts: cartsData,
    };

    // Respon sukses
    return successResponse(res, 200, "Berhasil merubah status carts", {
      data: usersCartsData,
    });
  } catch (error) {
    let statusCode = 500;

    if (
      error.message === "Data tidak valid!" ||
      error.message === "Produk tidak ada di keranjang belanja!"
    ) {
      statusCode = 400;
    }

    return errorResponse(res, statusCode, error.message);
  }
};

export {
  getUserCartController,
  addCartController,
  deleteCartByUidsController,
  deleteProductsCartController,
  deleteManyProductsCartController,
  toggleCartsStatusController,
  editCartsQtyController,
  toggleAllCartsStatusController,
};
