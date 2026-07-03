import { useSelector } from "react-redux";

function Cart() {
  const { items } = useSelector((state) => state.cart);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Cart</h1>

      {items.map((item) => (
        <div key={item._id} className="border p-3 mt-2">
          <p>{item.name}</p>
          <p>Qty: {item.quantity}</p>
          <p>₹{item.price}</p>
        </div>
      ))}

      <h2 className="mt-4 font-bold">Total: ₹{total}</h2>
    </div>
  );
}

export default Cart;