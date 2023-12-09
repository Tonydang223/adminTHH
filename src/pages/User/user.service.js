// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../api/fetchBaseQuery"

// Define a service using a base URL and expected endpoints
export const usrsApis = createApi({
  reducerPath: "usrsApis",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => {
        return {
          url: "user/getAll",
          credentials: "include",
        };
      },
      transformResponse: (response) => {
        return response.data;
      }
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUsersQuery
} = usrsApis;
