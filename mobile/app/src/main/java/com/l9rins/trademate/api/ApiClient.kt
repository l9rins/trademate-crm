package com.l9rins.trademate.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    @Volatile
    private var retrofit: Retrofit? = null
    private var currentBaseUrl: String? = null

    var tokenProvider: (() -> String?)? = null

    private val logging = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val client = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val requestBuilder = chain.request().newBuilder()
            tokenProvider?.invoke()?.let { token ->
                requestBuilder.addHeader("Authorization", "Bearer $token")
            }
            chain.proceed(requestBuilder.build())
        }
        .addInterceptor(logging)
        .connectTimeout(30, TimeUnit.SECONDS) // Added timeouts
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    // Thread-safe Singleton that respects the dynamic Base URL
    fun <T> getApi(baseUrl: String, apiClass: Class<T>): T {
        return synchronized(this) {
            if (retrofit == null || currentBaseUrl != baseUrl) {
                currentBaseUrl = baseUrl
                retrofit = Retrofit.Builder()
                    .baseUrl(baseUrl)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(client)
                    .build()
            }
            retrofit!!.create(apiClass)
        }
    }
}