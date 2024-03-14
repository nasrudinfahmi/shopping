import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { getPathFromFirebaseStorageUrl } from "../../../utils/utils";
import { storage } from "../init";

const uploadFileToStorage = async (url, file) => {
  try {
    const storageRef = ref(storage, url);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);
    return photoURL;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteFileFromStorage = async (url) => {
  try {
    if (!url) return;
    const prevImg = getPathFromFirebaseStorageUrl(url);
    if (prevImg) {
      const prevImgStorageRef = ref(storage, prevImg);
      await deleteObject(prevImgStorageRef);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export { uploadFileToStorage, deleteFileFromStorage };
