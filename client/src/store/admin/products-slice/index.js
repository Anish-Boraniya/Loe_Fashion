import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  local : [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      `${url}/api/admin/products/add`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get(
      `${url}/api/admin/products/get`
    );

    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/api/edit",
  async ({ id, formData }) => {
    try {
      console.log("Sending edit request for ID:", id, "with data:", formData);
      const response = await axios.put(`${url}/api/admin/products/edit/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response?.data;
    } catch (error) {
       throw new Error(error.response?.data?.message || error.message);
    }
  }
);

export const getLocal = createAsyncThunk(
  "getLocal",
  async () => {
    const response =  localStorage.getItem("category")
    return response;
  }
)

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `${url}/api/admin/products/delete/${id}`
    );

    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
      builder.addCase(getLocal.pending, (state, action) => {
        state.isLoading = true;
      });
      builder.addCase(getLocal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.local = action.payload;
        console.log("localstorege", state.local)
      });
      builder.addCase(getLocal.rejected, (state, action) => {
        state.isLoading = false;
        state.local = [];
      });
  },
});

export default AdminProductsSlice.reducer;
