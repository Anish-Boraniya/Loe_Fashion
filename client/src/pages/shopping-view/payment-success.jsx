import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(()=>{
     const updateOrderStatus  = async () => {
       try {
        const response = await axios.put(`http://localhost:5000/api/admin/orders/update/${orderId}`,
          {
            orderStatus: "confirmed", // Set status to confirmed
            paymentStatus: "paid", // Set payment status to paid
          }
        );

        if (response.data.success) {
          console.log("Order status updated successfully");
        } else {
          console.error("Failed to update order status:", response.data.message);
        }
       
      } catch (error) {
        console.error("Error updating order status:", error);
      }
     }

     updateOrderStatus();
  },[orderId])

  return (
    <div className=" flex h-screen items-center justify-center">
      <Card className="w-[40vw] h-[40vh] bg-green-400 flex flex-col gap-5 drop-shadow-2xl rounded-xl items-center justify-center">
      <CardHeader className="p-0 ">
        <CardTitle className="text-4xl">Payment is successfull!</CardTitle>
      </CardHeader>
      <Button className="mt-5" onClick={() => navigate("/shop/account")}>
        View Orders
      </Button>
    </Card>
    </div>
  );
}

export default PaymentSuccessPage;
