import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters from the URL
  const params = new URLSearchParams(location.search);
  const razorpayPaymentId = params.get("razorpay_payment_id");
  const razorpayOrderId = params.get("razorpay_order_id");
  const razorpaySignature = params.get("razorpay_signature");

  useEffect(() => {
    if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
      // Retrieve the orderId from sessionStorage
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      // Dispatch the capturePayment action with Razorpay payment details
      dispatch(
        capturePayment({
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
          orderId,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          // Clear the orderId from sessionStorage
          sessionStorage.removeItem("currentOrderId");
          console.log("Order seccess completed")
          // Redirect to the payment success page
          navigate("/shop/payment-success");
        } else {
          // Handle payment failure

        }
      });
    } else {
      // If payment details are missing, redirect to the payment failed page
      navigate("/shop/paymentFailure");
      console.log("Payment details are missing")
    }
  }, [razorpayPaymentId, razorpayOrderId, razorpaySignature, dispatch, navigate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
