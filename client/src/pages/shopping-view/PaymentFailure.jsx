import { Link } from "react-router-dom";

function PaymentFailure() {
  return (
    <div className="max-w-md mt-[30vh] mx-auto p-6 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Payment Failed</h2>
      <p className="text-gray-600 mb-6">Please try again or use a different payment method.</p>
      <Link
        to="/shop/checkout"
        className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Try Again
      </Link>
    </div>
  );
}

export default PaymentFailure;