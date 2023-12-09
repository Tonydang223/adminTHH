// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../api/fetchBaseQuery";

// Define a service using a base URL and expected endpoints
export const productApis = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProduct: builder.query({
      query: () => {
        return {
          url: "products/all",
          credentials: "include",
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Product", _id })), "Product"]
          : ["Product"],
    }),
    createProduct: builder.mutation({
      query: (body) => {
        return {
          url: "products/parts",
          method: "POST",
          body,
          credentials: "include",
        };
      },
      invalidatesTags: ["Product"],
    }),
    getOneProduct: builder.query({
      query: (query) => {
        return {
          url: `products/${query}`,
          credentials: "include",
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
    }),
    editProduct: builder.mutation({
      query: (data) => {
        console.log("🚀 ~ file: product.service.js:50 ~ data:", data);
        return {
          url: `products/${data.id}`,
          method: "POST",
          body: data.body,
          credentials: "include",
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: "Product", _id: arg._id }],
    }),
    deleteProductRestore: builder.mutation({
      query: (data) => {
        return {
          url: `products/del/restore`,
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      invalidatesTags: ["Product"],
    }),
    deleteProductRestoreBack: builder.mutation({
      query: (data) => {
        return {
          url: `products/del/restore/back`,
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
        query: (data) => {
          return {
            url: `products/del`,
            method: "POST",
            body: data,
            credentials: "include",
          };
        },
        invalidatesTags: ["Product"],
      }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateProductMutation,
  useGetProductQuery,
  useGetOneProductQuery,
  useEditProductMutation,
  useDeleteProductRestoreMutation,
  useDeleteProductRestoreBackMutation,
  useDeleteProductMutation
} = productApis;
