import React, { useEffect } from "react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaTruck } from "react-icons/fa6";
import { IoArrowUndoSharp } from "react-icons/io5";
import { AiFillProduct } from "react-icons/ai";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { FcSalesPerformance } from "react-icons/fc";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";


function AdminDashboard() {
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const { productList } = useSelector((state) => state.adminProducts);
  

  const dispatch = useDispatch()
  

  const totalSale = orderList.reduce((total, order) => total + (order.totalAmount || 0), 0);

  // Count pending orders.length;
  const pendingOrders = orderList.filter(order => order.orderStatus === "confirmed").length;

  // Count delivered orders
  const deliveredOrders = orderList.filter(order => order.orderStatus === "delivered");

  const totalErning = deliveredOrders.reduce((total, order) => total + (order.totalAmount || 0), 0); 
  
  useEffect(() => {
    const fetchData = async () => {
        await Promise.all([
          dispatch(fetchAllProducts()),
          dispatch(getAllOrdersForAdmin()),
        ]);
      };
      fetchData();
  }, [dispatch]); 
  
  return (
    <div>
      <div>
      <h1 className=" ml-2 text-3xl font-bold"> Dashboard</h1>
      </div>
      <div className='flex pl-[4vw] gap-[5vw] mt-10 flex-wrap'>
        {/* items */}
        <div className='w-[20vw] rounded-xl drop-shadow-xl h-[25vh] bg-white overflow-hidden'>
            <div className='flex gap-5 mt-3 items-center px-5 text-lg  h-[30%]'><div className='bg-zinc-100 p-3 rounded-lg'><FcSalesPerformance /></div>Total Sale</div>
            <div className='text-3xl h-20 flex items-center justify-center -ml-10 font-semibold'>
                 <BiRupee />{totalSale}
            </div>
        </div>
        <div className='w-[20vw] rounded-xl drop-shadow-xl h-[25vh] bg-white overflow-hidden'>
            <div className='flex gap-5 mt-3 items-center px-5 text-lg  h-[30%]'><div className='bg-zinc-100 p-3 rounded-lg'><FaMoneyBillTrendUp /></div>Total Ernings</div>
            <div className='text-3xl h-20 flex items-center justify-center -ml-10 font-semibold'>
                 <BiRupee />{totalErning}
            </div>
        </div>
        <div className='w-[20vw] rounded-xl drop-shadow-xl h-[25vh] bg-white overflow-hidden'>
            <div className='flex gap-5 mt-3 items-center px-5 text-lg  h-[30%]'><div className='bg-zinc-100 p-3 rounded-lg'><MdOutlinePendingActions /></div>Pending Orders</div>
            <div className='text-3xl h-20 flex items-center justify-center -ml-10 font-semibold'>
               {pendingOrders}
            </div>
        </div>
        <div className='w-[20vw] rounded-xl drop-shadow-xl h-[25vh] bg-white overflow-hidden'>
            <div className='flex gap-5 mt-3 items-center px-5 text-lg  h-[30%]'><div className='bg-zinc-100 p-3 rounded-lg'><FaTruck /></div>Delivered Orders</div>
            <div className='text-3xl h-20 flex items-center justify-center -ml-10 font-semibold'>
                {deliveredOrders.length}
            </div>
        </div>
        <div className='w-[20vw] rounded-xl drop-shadow-xl h-[25vh] bg-white overflow-hidden'>
            <div className='flex gap-5 mt-3 items-center px-5 text-lg  h-[30%]'><div className='bg-zinc-100 p-3 rounded-lg'><IoArrowUndoSharp /></div>Return Orders</div>
            <div className='text-3xl h-20 flex items-center justify-center -ml-10 font-semibold'>
                0
            </div>
        </div>
        <div className='w-[20vw] rounded-xl drop-shadow-xl h-[25vh] bg-white overflow-hidden'>
            <div className='flex gap-5 mt-3 items-center px-5 text-lg  h-[30%]'><div className='bg-zinc-100 p-3 rounded-lg'><AiFillProduct /></div>Total Products</div>
            <div className='text-3xl h-20 flex items-center justify-center -ml-10 font-semibold'>
                {productList.length}
            </div>
        </div>
        {/* end */}
      </div>
    </div>
      );
}

export default AdminDashboard;
