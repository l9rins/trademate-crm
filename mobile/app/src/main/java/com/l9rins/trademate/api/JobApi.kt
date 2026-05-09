package com.l9rins.trademate.api

import com.l9rins.trademate.data.Job
import retrofit2.Response
import retrofit2.http.*

interface JobApi {
    @GET("/api/jobs")
    suspend fun getJobs(): Response<List<Job>>

    @POST("/api/jobs")
    suspend fun createJob(@Body job: Job): Response<Job>

    @PUT("/api/jobs/{id}")
    suspend fun updateJob(@Path("id") id: Long, @Body job: Job): Response<Job>

    @DELETE("/api/jobs/{id}")
    suspend fun deleteJob(@Path("id") id: Long): Response<Unit>
}
