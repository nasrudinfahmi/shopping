const formattedIDR = (price) => {
  const num = Number(price);
  const IDR = num.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return IDR.replace(",00", "");
};

export { formattedIDR };
