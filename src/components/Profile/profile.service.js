import { createApi } from "@reduxjs/toolkit/query/react";
import { setUser } from "../../pages/Auth/authSlice";
import baseQueryWithReauth from "../../api/fetchBaseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => {
        return {
          url: "user/getInfo",
          credentials: "include",
        };
      },
      transformResponse: (result) => {
        return result.data.user;
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
            dispatch(setUser(data));
        } catch (error) {
          console.log(error.message);
        }
      },
      
    }),
    editMe: builder.mutation({
      query: (body) => {
        return {
          url: "user/editProfile",
          method: "POST",
          body,
          credentials: "include",
        };
      },
      transformResponse: (result) => {
        return result.data;
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.log(error.message);
        }
      },
    }),
  }),
});

export const { useEditMeMutation, useGetMeQuery } = userApi;
