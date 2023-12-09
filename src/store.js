import { configureStore } from '@reduxjs/toolkit'
import userReducer from './pages/Auth/authSlice';
import { ApisAuth } from './pages/Auth/auth.service'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from './components/Profile/profile.service'
import { productApis } from './pages/Product/product.service'
import { courseApis } from './pages/Course/course.service'
import { postApis } from './pages/Posts/post.service'
import { usrsApis } from './pages/User/user.service'

export const store = configureStore({
  reducer: {
    user: userReducer,
    [ApisAuth.reducerPath]: ApisAuth.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApis.reducerPath]: productApis.reducer,
    [courseApis.reducerPath]: courseApis.reducer,
    [postApis.reducerPath]: postApis.reducer,
    [usrsApis.reducerPath]: usrsApis.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    ApisAuth.middleware,
    userApi.middleware,
    productApis.middleware,
    courseApis.middleware,
    postApis.middleware,
    usrsApis.middleware,
  ])
})

setupListeners(store.dispatch);