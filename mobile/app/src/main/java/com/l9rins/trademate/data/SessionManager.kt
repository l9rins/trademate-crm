package com.l9rins.trademate.data

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("user_session", Context.MODE_PRIVATE)

    fun saveToken(token: String) {
        prefs.edit().putString("jwt_token", token).apply()
    }

    fun getToken(): String? {
        return prefs.getString("jwt_token", null)
    }

    fun saveBaseUrl(url: String) {
        prefs.edit().putString("base_url", url).apply()
    }

    fun getBaseUrl(): String {
        return prefs.getString("base_url", "https://trademate-api-a19e.onrender.com/") ?: "https://trademate-api-a19e.onrender.com/"
    }

    fun isMockMode(): Boolean {
        return prefs.getBoolean("mock_mode", false)
    }

    fun setMockMode(enabled: Boolean) {
        prefs.edit().putBoolean("mock_mode", enabled).apply()
    }

    fun logout() {
        prefs.edit().clear().apply()
    }
}