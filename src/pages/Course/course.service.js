// Need to use the React-specific entry point to import createApi
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../api/fetchBaseQuery";

// Define a service using a base URL and expected endpoints
export const courseApis = createApi({
  reducerPath: "courseApis",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Course", "Lecture"],
  endpoints: (builder) => ({
    addCourse: builder.mutation({
      query: (body) => {
        return {
          url: "course/parts",
          method: "POST",
          body,
          credentials: "include",
        };
      },
      invalidatesTags: ["Course"],
    }),
    getCourses: builder.query({
      query: () => {
        return {
          url: "course/parts",
          credentials: "include",
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Course", _id })), "Course"]
          : ["Course"],
    }),
    getOneCourse: builder.query({
      query: (param) => {
        return {
          url: `course/parts/${param}`,
          credentials: "include",
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
    }),
    editCourse: builder.mutation({
      query: (data) => {
        return {
          url: `course/${data.id}`,
          method: "POST",
          body: data.body,
          credentials: "include",
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Course", _id: arg._id },
      ],
    }),
    postLectures: builder.mutation({
      query: (data) => {
        return {
          url: `lecture/parts/${data.id}`,
          method: "POST",
          body: data.body,
          credentials: "include",
        };
      },
      invalidatesTags: ["Lecture"],
    }),
    getLecturesOfCourse: builder.query({
      query: (id) => {
        return {
          url: `lecture/parts/${id}`,
          credentials: "include",
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["Lecture"],
    }),
    deleteCourseRestore: builder.mutation({
      query: (data) => {
        return {
          url: `course/del/restore`,
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      invalidatesTags: ["Course"],
    }),
    deleteCourseRestoreBack: builder.mutation({
      query: (data) => {
        return {
          url: `course/del/restore/back`,
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      invalidatesTags: ["Course"],
    }),
    deleteCourse: builder.mutation({
      query: (data) => {
        return {
          url: `course/del/selections`,
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      invalidatesTags: ["Course"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAddCourseMutation,
  useGetCoursesQuery,
  useGetOneCourseQuery,
  useEditCourseMutation,
  useGetLecturesOfCourseQuery,
  usePostLecturesMutation,
  useDeleteCourseMutation,
  useDeleteCourseRestoreMutation,
  useDeleteCourseRestoreBackMutation,
} = courseApis;
