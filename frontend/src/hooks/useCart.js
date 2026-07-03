import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "../redux/slices/cartSlice";

export const useCart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const addItem = (product) => dispatch(addToCart(product));
  const removeItem = (id) => dispatch(removeFromCart(id));
  const clear = () => dispatch(clearCart());

  return {
    items,
    total,
    addItem,
    removeItem,
    clear,
    count: items.length,
  };
};