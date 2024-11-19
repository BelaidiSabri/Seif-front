import React from "react";
import "../../CSS/CartPage.css";
import Cart from "./Cart";
import { CartCheckout } from "./CartCheckout";

const CartPage = () => {
  return (
    <div className="cart-page">
      <div>
        <Cart />
      </div>
      <div>
        <CartCheckout />
      </div>
    </div>
  );
};

export default CartPage;
