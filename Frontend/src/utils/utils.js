const formattedIDR = (price) => {
  const num = Number(price);
  const IDR = num.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return IDR.replace(",00", "");
};

const getValueById = (idValue) => {
  if (!idValue) return null;
  const element = document.getElementById(idValue);

  return element.value.trim();
};

export { formattedIDR, getValueById };
