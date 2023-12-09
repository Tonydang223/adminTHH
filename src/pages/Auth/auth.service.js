// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../api/fetchBaseQuery";

// Define a service using a base URL and expected endpoints
export const ApisAuth = createApi({
  reducerPath: "apisAuth",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => {
        return {
          url: "auth/login",
          method: "POST",
          body,
        };
      },
    }),
    logout: builder.mutation({
      query: () => {
        return {
          url: "auth/logout",
          method: "GET",
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useLogoutMutation } = ApisAuth;
