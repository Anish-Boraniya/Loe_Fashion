import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orderId: null,
  razorpayOrderId: null, // Add Razorpay order ID
  razorpayPaymentId: null, //add payment id
  razorpaySignature: null, // add signature
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('Creating Order with Data:', orderData);
      const response = await axios.post(
        "http://localhost:5000/api/shop/order/create",
        orderData
      );
      
      console.log('Order Creation Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Axios Order Creation Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId }) => { //update parameters
    const response = await axios.post(
      "http://localhost:5000/api/shop/order/capture",
      {
        razorpayPaymentId, //update payload
        razorpayOrderId,
        razorpaySignature,
        orderId,
      }
    );

    return response.data;
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/order/list/${userId}`
    );

    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/order/details/${id}`
    );

    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    setRazorpayPaymentDetails: (state, action) => {
      state.razorpayPaymentId = action.payload.razorpayPaymentId;
      state.razorpaySignature = action.payload.razorpaySignature;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action.payload.orderId;
        state.razorpayOrderId = action.payload.razorpayOrderId; // Store Razorpay order ID
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.orderId = null;
        state.razorpayOrderId = null;
      })
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(capturePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        action.fulfilled = true;
        // Handle successful payment capture (e.g., update order status)
        // You might want to add more specific state updates here
      })
      .addCase(capturePayment.rejected, (state) => {
        state.isLoading = false;

        // Handle payment capture failure
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails, setRazorpayPaymentDetails } = shoppingOrderSlice.actions; //add the new reducer.

export default shoppingOrderSlice.reducer;