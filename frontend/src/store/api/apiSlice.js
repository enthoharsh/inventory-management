import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5050/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Products', 'Dashboard'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getProducts: builder.query({
      query: ({ search, category, page = 1, limit = 10 } = {}) => {
        let url = `/products?page=${page}&limit=${limit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        return url;
      },
      providesTags: (result) =>
        result?.data?.products
          ? [
              ...result.data.products.map((product) => ({ type: 'Products', id: product._id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: [
        { type: 'Products', id: 'LIST' },
        { type: 'Dashboard', id: 'ANALYTICS' },
      ],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Products', id },
        { type: 'Products', id: 'LIST' },
        { type: 'Dashboard', id: 'ANALYTICS' },
      ],
    }),
    getDashboard: builder.query({
      query: () => '/movements/dashboard',
      providesTags: [{ type: 'Dashboard', id: 'ANALYTICS' }],
    }),
    adjustStock: builder.mutation({
      query: (adjustment) => ({
        url: '/movements/adjust',
        method: 'POST',
        body: adjustment,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Products', id: productId },
        { type: 'Products', id: 'LIST' },
        { type: 'Dashboard', id: 'ANALYTICS' },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetDashboardQuery,
  useAdjustStockMutation,
} = apiSlice;
