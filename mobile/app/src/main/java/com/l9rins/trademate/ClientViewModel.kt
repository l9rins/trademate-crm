package com.l9rins.trademate

import android.app.Application
import android.content.Intent
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.l9rins.trademate.data.AppDatabase
import com.l9rins.trademate.data.Client
import com.l9rins.trademate.data.ClientRepository
import com.l9rins.trademate.data.SessionManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class ClientViewModel(application: Application) : AndroidViewModel(application) {
    private val sessionManager = SessionManager(application)
    private val repository: ClientRepository = ClientRepository(AppDatabase.getDatabase(application).clientDao(), sessionManager)

    init {
        // Sync with remote on startup
        viewModelScope.launch { repository.syncWithRemote() }
    }

    // Direct stream from DB, hot-swapped into UI state
    val allClients: StateFlow<List<Client>> = repository.allClients
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val searchQuery = MutableStateFlow("")

    // Efficiently filters list in memory without querying DB on every char
    val filteredClients: StateFlow<List<Client>> = combine(allClients, searchQuery) { clients, query ->
        if (query.isBlank()) clients
        else clients.filter {
            it.name.contains(query, ignoreCase = true) ||
                    it.email.contains(query, ignoreCase = true)
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addClient(name: String, email: String, phone: String) {
        viewModelScope.launch {
            repository.insert(Client(name = name, email = email, phone = phone))
        }
    }

    fun deleteClient(client: Client) {
        viewModelScope.launch { repository.delete(client) }
    }

    fun makeCall(phone: String) {
        val intent = Intent(Intent.ACTION_DIAL).apply {
            data = Uri.parse("tel:$phone")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        getApplication<Application>().startActivity(intent)
    }
}