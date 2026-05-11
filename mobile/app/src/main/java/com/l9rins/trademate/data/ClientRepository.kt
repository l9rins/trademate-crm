package com.l9rins.trademate.data

import com.l9rins.trademate.api.ApiClient
import com.l9rins.trademate.api.ClientApi
import kotlinx.coroutines.flow.Flow

class ClientRepository(
    private val clientDao: ClientDao,
    private val sessionManager: SessionManager
) {

    val allClients: Flow<List<Client>> = clientDao.getAllClients()

    private fun getApi() = ApiClient.getApi(sessionManager.getBaseUrl(), ClientApi::class.java)

    suspend fun insert(client: Client) {
        clientDao.insertClient(client)
        if (!sessionManager.isMockMode()) {
            try {
                getApi().createClient(client)
            } catch (e: Exception) {
                // Log sync error
            }
        }
    }

    suspend fun delete(client: Client) {
        clientDao.deleteClient(client)
        if (!sessionManager.isMockMode()) {
            try {
                getApi().deleteClient(client.id)
            } catch (e: Exception) {
                // Log sync error
            }
        }
    }

    suspend fun syncWithRemote() {
        if (sessionManager.isMockMode()) return
        try {
            val response = getApi().getClients()
            if (response.isSuccessful) {
                response.body()?.forEach { clientDao.insertClient(it) }
            }
        } catch (e: Exception) {
            // Log sync error
        }
    }
}