import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3001', credentials: 'include'}),
    tagTypes: ['Order', 'Users'],
    endpoints: (builder) => ({
        
    })
})