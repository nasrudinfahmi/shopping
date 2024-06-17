import { cartCollection } from "../lib/firebaseAdmin/services/firestore.js";
import { areObjectsEqual, generateRandomId } from "../utils/utils.js";

const cartsSnapshot = async (email) => {
  try {
    const usersCartSnapshot = await cartCollection()
      .where("email", "==", email)
      .get();

    return usersCartSnapshot;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addCart = async ({ email, qty, variations, uid, uids, storeName }) => {
  try {
    const usersCartSnapshot = await cartsSnapshot(email);

    const newData = {
      idCart: generateRandomId(),
      uid,
      qty,
      variations,
      storeName,
      isReady: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (usersCartSnapshot.empty) {
      // Jika keranjang belanja kosong, buat keranjang baru
      return await cartCollection()
        .doc()
        .create({ email, carts: [{ uids, storeName, products: [newData] }] });
    }

    // Keranjang belanja tidak kosong, iterasi melalui setiap dokumen
    usersCartSnapshot.forEach(async (doc) => {
      let carts = doc.data().carts;

      const existingCart = carts.find((cart) => cart.uids === uids);

      if (existingCart) {
        // Jika ada keranjang yang sesuai dengan uids
        const existingProduct = existingCart.products.find(
          (item) =>
            item.uid === uid && areObjectsEqual(item.variations, variations)
          // JSON.stringify(item.variations) === JSON.stringify(variations)
        );

        if (existingProduct) {
          // Jika ada produk yang sesuai dengan uid dan variasi
          existingProduct.qty = Number(existingProduct.qty) + Number(qty);
        } else {
          // Jika tidak ada produk yang sesuai dengan uid dan variasi, tambahkan produk baru
          existingCart.products.push(newData);
        }
      } else {
        // Jika tidak ada keranjang yang sesuai dengan uids, tambahkan keranjang baru
        carts.push({ uids, storeName, products: [newData] });
      }

      // Perbarui data keranjang di database
      await doc.ref.update({ carts });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export { cartsSnapshot, addCart };
