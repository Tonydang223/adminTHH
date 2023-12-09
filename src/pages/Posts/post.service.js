// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../api/fetchBaseQuery"

// Define a service using a base URL and expected endpoints
export const postApis = createApi({
  reducerPath: "postApis",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    addPost: builder.mutation({
      query: (body) => {
        return {
          url: "post/create",
          method: "POST",
          body,
          credentials: "include",
        };
      },
      invalidatesTags: ["Post"],
    }),
    getPosts: builder.query({
      query: () => {
        return {
          url: "post/parts",
          credentials: "include",
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Post", _id })), "Post"]
          : ["Post"],
    }),
    getOnePost: builder.query({
      query: (param) => {
        return {
          url: `post/parts/${param}`,
          credentials: "include",
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
    }),
    editPost: builder.mutation({
      query: (data) => {
        return {
          url: `post/edit/${data.id}`,
          method: "POST",
          body: data.body,
          credentials: "include",
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Post", _id: arg._id },
      ],
    }),
    deletePostRestore: builder.mutation({
      query: (data) => {
        return {
          url: `post/del/restore`,
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      invalidatesTags: ["Post"],
    }),
    deletePostRestoreBack: builder.mutation({
      query: (data) => {
        return {
          url: `post/del/restore/back`,
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (data) => {
        return {
          url: `post/del/selections`,
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      invalidatesTags: ["Post"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAddPostMutation,
  useEditPostMutation,
  useGetPostsQuery,
  useGetOnePostQuery,
  useDeletePostMutation,
  useDeletePostRestoreBackMutation,
  useDeletePostRestoreMutation,
} = postApis;
