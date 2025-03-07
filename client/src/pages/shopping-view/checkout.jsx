import Address from "../../components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "../../components/shopping-view/cart-items-content";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import {
  createNewOrder,
  capturePayment,
  setRazorpayPaymentDetails,
} from "../../store/shop/order-slice"; // Import capturePayment and setRazorpayPaymentDetails
import { useToast } from "../../components/ui/use-toast";
import { BiRupee } from "react-icons/bi";
import Razorpay from "react-razorpay";
import { useNavigate } from "react-router-dom";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { razorpayOrderId, orderId } = useSelector((state) => state.shopOrder); // Access razorpayOrderId and orderId
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const key_id = import.meta.env.VITE_RAZORPAY_KEY_ID;

  console.log("key-id", key_id);

  console.log(currentSelectedAddress, "cartItems");
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiateRazorpayPayment() {
    if (cartItems.length === 0 || currentSelectedAddress === null) {
      toast({
        title:
          cartItems.length === 0
            ? "Your cart is empty."
            : "Please select an address.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "razorpay", // Set paymentMethod to razorpay
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
    dispatch(createNewOrder(orderData)).then((action) => {
      if (action.payload?.success) {
        setIsPaymentStart(true);

        // Initialize Razorpay payment
        const options = {
          key: key_id,
          amount: Math.round(totalCartAmount * 100),
          currency: "INR",
          order_id: action.payload.razorpayOrderId, // Use the order ID from the API response
          name: "Leo Fashion",
          description: "Purchase Description",
          handler: function (response) {
            handlePayment(response);
          },
          prefill: {
            name: user?.name || "Guest",
            email: user?.email || "",
            contact: currentSelectedAddress?.phone || "",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        } else {
          setIsPaymentStart(false);
          toast({
            title: "Error creating order",
            description: action.payload?.message || "Unknown error",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Order Creation Error:", error);
        toast({
          title: "Error creating order",
          description: error.message,
          variant: "destructive",
        });
      });
  }

  const handlePayment = (response) => {
    console.log("Razorpay payment response:", response);
  
    // Check if we have all required parameters
    if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
      console.error("Missing required Razorpay parameters");
      toast({
        title: "Payment Failed",
        description: "Missing payment verification parameters",
        variant: "destructive",
      });
      navigate("/shop/paymentFailure");
      return;
    }
  
    // Dispatch action to store payment details
    dispatch(
      setRazorpayPaymentDetails({
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      })
    );
  
    // Dispatch action to capture payment
    dispatch(
      capturePayment({
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        orderId: orderId,
      })
    ).then((data) => {
       try{
        if (data) {
          navigate("/shop/payment-success");
          toast({
            title: "Payment Successful",
            description: "Your order has been placed.",
          });
        } else {
          // Instead of redirecting to paypal-return, go directly to payment-failed
          navigate("/shop/paymentFailure");
          console.log("Your order has been not completed")
          toast({
            title: "Payment Failed",
            description: data?.payload?.message || "Please try again.",
            variant: "destructive",
          });
        }
       }catch(e){
        console.error("Error while processing payment:", e);
        toast({
          title: "Payment Processing Error",
          description: "An error occurred while processing your payment.",
          variant: "destructive",
        });
       }
      })
      .catch((error) => {
        console.error("Payment capture error:", error);
        navigate("/shop/paymentFailure");
        toast({
          title: "Payment Processing Error",
          description: "An error occurred while processing your payment.",
          variant: "destructive",
        });
      });
  };
  const razorpayOptions = {
    key: key_id,
    amount: Math.round(totalCartAmount * 100),
    currency: "INR",
    order_id: razorpayOrderId,
    handler: handlePayment,
    name: "Your Company Name", // Add your company name
    description: "Purchase Description", // Add a description
    prefill: {
      name: user?.name || "Guest", // Prefill user name
      email: user?.email || "", // Prefill user email
      contact: currentSelectedAddress?.phone || "", //Prefill user contact
    },
    theme: {
      color: "#3399cc",
    },
  };

  /*if (approvalURL) {
    window.location.href = approvalURL;
  }*/

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold flex items-center">
                <BiRupee />
                {totalCartAmount}
              </span>
            </div>
          </div>
          <div className="mt-4 w-full">
          <Button onClick={handleInitiateRazorpayPayment} className="w-full">
              {isPaymentStart
                ? "Processing Razorpay Order..."
                : "Checkout with Razorpay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
