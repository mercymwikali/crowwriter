import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({baseUrl:'https://crowwriter-api.vercel.app/', credentials: 'include'}),
    tagTypes: ['Order', 'Users'],
    endpoints: (builder) => ({
        
    })
})
