package com.l9rins.trademate

import android.app.Application
import android.content.Intent
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.l9rins.trademate.data.AppDatabase
import com.l9rins.trademate.data.Job
import com.l9rins.trademate.data.JobRepository
import com.l9rins.trademate.data.SessionManager
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class JobViewModel(application: Application) : AndroidViewModel(application) {
    private val sessionManager = SessionManager(application)
    private val repository = JobRepository(AppDatabase.getDatabase(application).jobDao(), sessionManager)

    init {
        // Sync with remote on startup
        viewModelScope.launch { repository.syncWithRemote() }
    }

    // Data Streams using stateIn for lifecycle safety
    val allJobs = repository.allJobs
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val statsActive = repository.statsActive
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val statsPending = repository.statsPending
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val statsCompleted = repository.statsCompleted
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val statsRevenue = repository.statsRevenue.map { it ?: 0.0 }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    fun addJob(title: String, clientName: String, price: Double, status: String, date: String) {
        viewModelScope.launch {
            repository.insertJob(Job(title = title, clientName = clientName, price = price, status = status, date = date))
        }
    }

    fun updateJob(job: Job) = viewModelScope.launch { repository.insertJob(job) }

    fun deleteJob(job: Job) = viewModelScope.launch { repository.deleteJob(job) }

    fun shareInvoice(context: android.content.Context, job: Job) {
        PDFGenerator.generateAndShareInvoice(context, job)
    }

    fun addToCalendar(context: android.content.Context, job: Job) {
        val intent = Intent(Intent.ACTION_INSERT).apply {
            data = android.provider.CalendarContract.Events.CONTENT_URI
            putExtra(android.provider.CalendarContract.Events.TITLE, "Job: ${job.title}")
            putExtra(android.provider.CalendarContract.Events.DESCRIPTION, "Client: ${job.clientName}\nStatus: ${job.status}")
            putExtra(android.provider.CalendarContract.Events.EVENT_LOCATION, "Client Site")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }
}