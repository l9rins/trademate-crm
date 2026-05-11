package com.l9rins.trademate.data

import com.l9rins.trademate.api.ApiClient
import com.l9rins.trademate.api.JobApi
import kotlinx.coroutines.flow.Flow

class JobRepository(
    private val jobDao: JobDao,
    private val sessionManager: SessionManager
) {
    val allJobs: Flow<List<Job>> = jobDao.getAllJobs()

    // Analytics Streams
    val statsActive: Flow<Int> = jobDao.getActiveCount()
    val statsPending: Flow<Int> = jobDao.getPendingCount()
    val statsCompleted: Flow<Int> = jobDao.getCompletedCount()
    val statsRevenue: Flow<Double?> = jobDao.getTotalRevenue()

    private fun getApi() = ApiClient.getApi(sessionManager.getBaseUrl(), JobApi::class.java)

    suspend fun insertJob(job: Job) {
        jobDao.insertJob(job)
        if (!sessionManager.isMockMode()) {
            try {
                getApi().createJob(job)
            } catch (e: Exception) {
                // Log sync error or handle offline
            }
        }
    }

    suspend fun deleteJob(job: Job) {
        jobDao.deleteJob(job)
        if (!sessionManager.isMockMode()) {
            try {
                getApi().deleteJob(job.id)
            } catch (e: Exception) {
                // Log sync error
            }
        }
    }

    suspend fun syncWithRemote() {
        if (sessionManager.isMockMode()) return
        try {
            val response = getApi().getJobs()
            if (response.isSuccessful) {
                response.body()?.forEach { jobDao.insertJob(it) }
            }
        } catch (e: Exception) {
            // Log sync error
        }
    }
}