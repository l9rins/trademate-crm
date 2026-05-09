package com.l9rins.trademate.ui.auth

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.l9rins.trademate.AnimatedGradientBackground
import com.l9rins.trademate.FloatingOrbs
import com.l9rins.trademate.GlassCard
import com.l9rins.trademate.PremiumButton
import com.l9rins.trademate.api.ApiClient
import com.l9rins.trademate.api.AuthApi
import com.l9rins.trademate.api.LoginRequest
import com.l9rins.trademate.api.RegisterRequest
import com.l9rins.trademate.data.SessionManager
import com.l9rins.trademate.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(onLoginSuccess: () -> Unit, onNavigateToRegister: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val sessionManager = remember { SessionManager(context) }

    Box(modifier = Modifier.fillMaxSize()) {
        AnimatedGradientBackground()
        FloatingOrbs()

        Column(
            modifier = Modifier.fillMaxSize().padding(28.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            GlassCard(modifier = Modifier.fillMaxWidth()) {
                // Brand header
                Text(
                    "TradeMate",
                    fontSize = 42.sp,
                    fontWeight = FontWeight.Black,
                    color = TradeMateGreen,
                    letterSpacing = (-2).sp
                )
                Text(
                    "PRECISION CRM",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = TextSecondary,
                    letterSpacing = 3.sp
                )

                Spacer(modifier = Modifier.height(40.dp))

                // Email field with icon
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Professional Email") },
                    leadingIcon = { Icon(Icons.Outlined.Email, null, tint = TextSecondary) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TradeMateGreen,
                        focusedLabelColor = TradeMateGreen,
                        cursorColor = TradeMateGreen
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Password field with icon
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Secure Password") },
                    leadingIcon = { Icon(Icons.Outlined.Lock, null, tint = TextSecondary) },
                    modifier = Modifier.fillMaxWidth(),
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    shape = RoundedCornerShape(14.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TradeMateGreen,
                        focusedLabelColor = TradeMateGreen,
                        cursorColor = TradeMateGreen
                    )
                )

                Spacer(modifier = Modifier.height(32.dp))

                PremiumButton(
                    text = "Authenticate",
                    loading = isLoading,
                    onClick = {
                        scope.launch {
                            isLoading = true
                            try {
                                if (sessionManager.isMockMode()) {
                                    delay(800)
                                    sessionManager.saveToken("mock_jwt_token")
                                    Toast.makeText(context, "Mock Login Successful", Toast.LENGTH_SHORT).show()
                                    onLoginSuccess()
                                } else {
                                    val baseUrl = sessionManager.getBaseUrl()
                                    val response = ApiClient.getApi(baseUrl, AuthApi::class.java).login(LoginRequest(email, password))
                                    if (response.isSuccessful && response.body()?.token != null) {
                                        sessionManager.saveToken(response.body()!!.token!!)
                                        Toast.makeText(context, "Login Successful", Toast.LENGTH_SHORT).show()
                                        onLoginSuccess()
                                    } else {
                                        val errorBody = response.errorBody()?.string()
                                        Toast.makeText(context, "Login Failed: ${response.code()} $errorBody", Toast.LENGTH_LONG).show()
                                    }
                                }
                            } catch (e: Exception) {
                                Toast.makeText(context, "Network Error: ${e.message}", Toast.LENGTH_LONG).show()
                            } finally {
                                isLoading = false
                            }
                        }
                    }
                )

                Spacer(modifier = Modifier.height(24.dp))

                TextButton(onClick = onNavigateToRegister, modifier = Modifier.align(Alignment.CenterHorizontally)) {
                    Text("NO ACCOUNT? JOIN THE NETWORK", color = TradeMateTeal, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }

                Spacer(modifier = Modifier.height(12.dp))
                HorizontalDivider(color = CardBorder.copy(alpha = 0.5f))
                Spacer(modifier = Modifier.height(12.dp))

                // Demo mode button
                TextButton(
                    onClick = {
                        sessionManager.setMockMode(true)
                        sessionManager.saveToken("demo_token")
                        Toast.makeText(context, "DEMO MODE ACTIVATED", Toast.LENGTH_SHORT).show()
                        onLoginSuccess()
                    },
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                ) {
                    Text("⚡ OFFLINE DEMO MODE", color = TradeMateGreen, fontWeight = FontWeight.Black, fontSize = 14.sp)
                }
            }

            if (sessionManager.isMockMode()) {
                Spacer(modifier = Modifier.height(16.dp))
                Text("● MOCK MODE ACTIVE", color = StatusOverdue, fontWeight = FontWeight.Black, fontSize = 10.sp)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(onRegisterSuccess: () -> Unit, onNavigateToLogin: () -> Unit) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val sessionManager = remember { SessionManager(context) }

    Box(modifier = Modifier.fillMaxSize()) {
        AnimatedGradientBackground()
        FloatingOrbs()

        Column(
            modifier = Modifier.fillMaxSize().padding(28.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            GlassCard(modifier = Modifier.fillMaxWidth()) {
                Text(
                    "Create Account",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black,
                    color = TextPrimary,
                    letterSpacing = (-1).sp
                )
                Text(
                    "JOIN THE NETWORK",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = TextSecondary,
                    letterSpacing = 2.sp
                )
                Spacer(modifier = Modifier.height(32.dp))

                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Full Name") },
                    leadingIcon = { Icon(Icons.Outlined.Person, null, tint = TextSecondary) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TradeMateGreen,
                        focusedLabelColor = TradeMateGreen,
                        cursorColor = TradeMateGreen
                    )
                )
                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email Address") },
                    leadingIcon = { Icon(Icons.Outlined.Email, null, tint = TextSecondary) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TradeMateGreen,
                        focusedLabelColor = TradeMateGreen,
                        cursorColor = TradeMateGreen
                    )
                )
                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Secure Password") },
                    leadingIcon = { Icon(Icons.Outlined.Lock, null, tint = TextSecondary) },
                    visualTransformation = PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TradeMateGreen,
                        focusedLabelColor = TradeMateGreen,
                        cursorColor = TradeMateGreen
                    )
                )

                Spacer(modifier = Modifier.height(32.dp))

                PremiumButton(
                    text = "Establish Access",
                    loading = isLoading,
                    onClick = {
                        scope.launch {
                            isLoading = true
                            try {
                                if (sessionManager.isMockMode()) {
                                    delay(800)
                                    Toast.makeText(context, "Registration Successful!", Toast.LENGTH_SHORT).show()
                                    onRegisterSuccess()
                                } else {
                                    val baseUrl = sessionManager.getBaseUrl()
                                    val response = ApiClient.getApi(baseUrl, AuthApi::class.java).register(RegisterRequest(name, email, password))
                                    if (response.isSuccessful) {
                                        Toast.makeText(context, "Registration Successful!", Toast.LENGTH_SHORT).show()
                                        onRegisterSuccess()
                                    } else {
                                        val errorBody = response.errorBody()?.string()
                                        Toast.makeText(context, "Registration Failed: ${response.code()} $errorBody", Toast.LENGTH_LONG).show()
                                    }
                                }
                            } catch (e: Exception) {
                                Toast.makeText(context, "Network Error: ${e.message}", Toast.LENGTH_LONG).show()
                            } finally {
                                isLoading = false
                            }
                        }
                    }
                )

                Spacer(modifier = Modifier.height(24.dp))

                TextButton(onClick = onNavigateToLogin, modifier = Modifier.align(Alignment.CenterHorizontally)) {
                    Text("EXISTING USER? SECURE LOGIN", color = TradeMateTeal, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }

                Spacer(modifier = Modifier.height(12.dp))
                HorizontalDivider(color = CardBorder.copy(alpha = 0.5f))
                Spacer(modifier = Modifier.height(12.dp))

                TextButton(
                    onClick = {
                        sessionManager.setMockMode(true)
                        Toast.makeText(context, "DEMO MODE PREPARED", Toast.LENGTH_SHORT).show()
                        onNavigateToLogin()
                    },
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                ) {
                    Text("⚡ TRY DEMO MODE", color = TradeMateGreen, fontWeight = FontWeight.Black, fontSize = 14.sp)
                }
            }
        }
    }
}

@Composable
fun AuthScreen(onLoginSuccess: () -> Unit) {
    var isLogin by remember { mutableStateOf(true) }
    if (isLogin) {
        LoginScreen(onLoginSuccess = onLoginSuccess, onNavigateToRegister = { isLogin = false })
    } else {
        RegisterScreen(onRegisterSuccess = { isLogin = true }, onNavigateToLogin = { isLogin = true })
    }
}
