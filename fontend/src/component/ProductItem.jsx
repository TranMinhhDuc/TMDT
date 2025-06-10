import { useContext } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { Link } from "react-router-dom";

const formatPrice = (num) => {
  const integerPart = Math.floor(Number(num));

  return integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const ProductItem = ({ id, name, price, image }) => {
    const { currency } = useContext(ShopContext);

    return (
        <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`} key={id}>
            <div className="overflow-hidden">
                <img className="w-full h-48 object-cover object-center hover:scale-110 transition ease-in-out" src={image} alt={name} />
            </div>
            <p className="pt-3 pb-1 text-sm"> {name} </p>
            <p className="text-sm font-semibold"> {formatPrice(price)} {currency} </p>
        </Link>
    );
};

export default ProductItem;
