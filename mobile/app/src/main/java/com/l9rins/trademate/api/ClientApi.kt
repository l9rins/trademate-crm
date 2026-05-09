package com.l9rins.trademate.api

import com.l9rins.trademate.data.Client
import retrofit2.Response
import retrofit2.http.*

interface ClientApi {
    @GET("/api/clients")
    suspend fun getClients(): Response<List<Client>>

    @POST("/api/clients")
    suspend fun createClient(@Body client: Client): Response<Client>

    @PUT("/api/clients/{id}")
    suspend fun updateClient(@Path("id") id: Long, @Body client: Client): Response<Client>

    @DELETE("/api/clients/{id}")
    suspend fun deleteClient(@Path("id") id: Long): Response<Unit>
}
