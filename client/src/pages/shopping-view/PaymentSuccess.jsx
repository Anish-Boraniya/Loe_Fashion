import { Link } from "react-router-dom";

function PaymentSuccess() {
  return (
    <div className="w-[50vw] h-[50vh] mx-auto mt-[20vh] bg-green-600 flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
      <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
      <Link
        to="/shop/account"
        className="inline-block bg-black text-white py-2 px-4 rounded-md hover:bg-zinc-900"
      >
        View Orders
      </Link>
    </div>
  );
}

export default PaymentSuccess;