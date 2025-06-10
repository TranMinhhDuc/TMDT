export const formatPrice = (num) => {
  const integerPart = Math.floor(Number(num));
  return integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

