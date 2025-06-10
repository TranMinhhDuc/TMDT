import React from "react";
import { assets } from "../assets/assets";

const Policy = () => {
    return (
        <div className="flex flex:col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
            <div>
                <img className="w-12 m-auto mb-5" src={assets.shipping_icon} alt="shipping_icon" />
                <p className="font-semibold">Miễn phí giao hàng toàn quốc</p>
            </div>

            <div>
                <img className="w-12 m-auto mb-5" src={assets.quality_icon} alt="shipping_icon" />
                <p className="font-semibold">Đổi trả trong 7 ngày</p>
            </div>
            
            <div>
                <img className="w-12 m-auto mb-5" src={assets.support_img} alt="shipping_icon" />
                <p className="font-semibold">Phục vụ 24/7</p>
            </div>
        </div>
    )
}

export default Policy;