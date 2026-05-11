package com.l9rins.trademate

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.l9rins.trademate.api.ApiClient
import com.l9rins.trademate.data.SessionManager
import com.l9rins.trademate.ui.auth.AuthScreen
import com.l9rins.trademate.ui.theme.TradeMateTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val sessionManager = SessionManager(this)
        ApiClient.tokenProvider = { sessionManager.getToken() }

        val clientViewModel = ViewModelProvider(this)[ClientViewModel::class.java]
        val jobViewModel = ViewModelProvider(this)[JobViewModel::class.java]

        setContent {
            TradeMateTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                // Hide bottom nav on auth screen
                val showBottomBar = currentRoute != null && currentRoute != "auth"

                Scaffold(
                    bottomBar = {
                        if (showBottomBar) {
                            BottomNavBar(navController = navController)
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "auth",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        // 1. Auth Screen
                        composable("auth") {
                            AuthScreen(
                                onLoginSuccess = {
                                    navController.navigate("dashboard") {
                                        popUpTo("auth") { inclusive = true }
                                    }
                                }
                            )
                        }

                        // 2. Dashboard
                        composable("dashboard") {
                            DashboardScreen(viewModel = jobViewModel)
                        }

                        // 3. Clients Screen
                        composable("clients") {
                            ClientScreen(viewModel = clientViewModel)
                        }

                        // 4. Jobs Screen
                        composable("jobs") {
                            JobScreen(viewModel = jobViewModel, clientViewModel = clientViewModel)
                        }

                        // 5. Settings Screen
                        composable("settings") {
                            SettingsScreen(navController = navController)
                        }
                    }
                }
            }
        }
    }
}
