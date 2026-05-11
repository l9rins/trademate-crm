package com.l9rins.trademate

// --- IMPORTS ---
import androidx.compose.animation.animateColor
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.l9rins.trademate.data.SessionManager
import com.l9rins.trademate.ui.theme.*

// ═══════════════════════════════════════════════
// 1. PREMIUM GLASS CARD
// ═══════════════════════════════════════════════
@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = modifier.shadow(
            elevation = 16.dp,
            shape = RoundedCornerShape(24.dp),
            spotColor = TradeMateGreen.copy(alpha = 0.15f),
            ambientColor = TradeMateGreen.copy(alpha = 0.08f)
        ),
        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.92f)),
        shape = RoundedCornerShape(24.dp),
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            Brush.linearGradient(
                colors = listOf(
                    Color.White.copy(alpha = 0.8f),
                    Color.White.copy(alpha = 0.3f)
                )
            )
        )
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            content()
        }
    }
}

// ═══════════════════════════════════════════════
// 2. ANIMATED GRADIENT BACKGROUND
// ═══════════════════════════════════════════════
@Composable
fun AnimatedGradientBackground() {
    val infiniteTransition = rememberInfiniteTransition(label = "gradient")
    val color1 by infiniteTransition.animateColor(
        initialValue = BackgroundLight,
        targetValue = TradeMateGreen.copy(alpha = 0.04f),
        animationSpec = infiniteRepeatable(
            animation = tween(5000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ), label = "c1"
    )
    val color2 by infiniteTransition.animateColor(
        initialValue = TradeMateTeal.copy(alpha = 0.03f),
        targetValue = BackgroundLight,
        animationSpec = infiniteRepeatable(
            animation = tween(7000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ), label = "c2"
    )
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(color1, color2, color1)
                )
            )
    )
}

// ═══════════════════════════════════════════════
// 3. FLOATING ORBS (for auth / dashboard)
// ═══════════════════════════════════════════════
@Composable
fun FloatingOrbs() {
    val infiniteTransition = rememberInfiniteTransition(label = "orbs")

    val offset1 by infiniteTransition.animateFloat(
        initialValue = 0f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(6000, easing = LinearEasing), RepeatMode.Reverse),
        label = "o1"
    )
    val offset2 by infiniteTransition.animateFloat(
        initialValue = 1f, targetValue = 0f,
        animationSpec = infiniteRepeatable(tween(8000, easing = LinearEasing), RepeatMode.Reverse),
        label = "o2"
    )
    val offset3 by infiniteTransition.animateFloat(
        initialValue = 0.3f, targetValue = 0.7f,
        animationSpec = infiniteRepeatable(tween(5000, easing = LinearEasing), RepeatMode.Reverse),
        label = "o3"
    )

    Canvas(modifier = Modifier.fillMaxSize()) {
        val w = size.width
        val h = size.height

        // Green orb — top right
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(OrbGreen.copy(alpha = 0.25f), Color.Transparent),
                center = Offset(w * (0.7f + offset1 * 0.2f), h * (0.1f + offset1 * 0.15f)),
                radius = w * 0.4f
            ),
            center = Offset(w * (0.7f + offset1 * 0.2f), h * (0.1f + offset1 * 0.15f)),
            radius = w * 0.4f
        )

        // Blue orb — bottom left
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(OrbBlue.copy(alpha = 0.2f), Color.Transparent),
                center = Offset(w * (0.2f + offset2 * 0.15f), h * (0.7f + offset2 * 0.1f)),
                radius = w * 0.35f
            ),
            center = Offset(w * (0.2f + offset2 * 0.15f), h * (0.7f + offset2 * 0.1f)),
            radius = w * 0.35f
        )

        // Purple orb — center
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(OrbPurple.copy(alpha = 0.12f), Color.Transparent),
                center = Offset(w * offset3, h * 0.5f),
                radius = w * 0.3f
            ),
            center = Offset(w * offset3, h * 0.5f),
            radius = w * 0.3f
        )
    }
}

// ═══════════════════════════════════════════════
// 4. STAT CARD
// ═══════════════════════════════════════════════
@Composable
fun StatCard(
    modifier: Modifier = Modifier,
    icon: ImageVector,
    label: String,
    value: String,
    trend: String? = null,
    isTrendPositive: Boolean = true
) {
    Card(
        modifier = modifier
            .aspectRatio(1.15f)
            .shadow(
                elevation = 8.dp,
                shape = RoundedCornerShape(22.dp),
                spotColor = Color.Black.copy(alpha = 0.08f)
            ),
        colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
        shape = RoundedCornerShape(22.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(20.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    TradeMateGreen.copy(alpha = 0.15f),
                                    TradeMateTeal.copy(alpha = 0.10f)
                                )
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, null, tint = TradeMateGreen, modifier = Modifier.size(22.dp))
                }
                if (trend != null) {
                    Box(
                        modifier = Modifier
                            .background(
                                if (isTrendPositive) TrendPositive.copy(alpha = 0.12f) else TrendNegative.copy(alpha = 0.12f),
                                RoundedCornerShape(10.dp)
                            )
                            .padding(horizontal = 10.dp, vertical = 5.dp)
                    ) {
                        Text(
                            text = trend,
                            color = if (isTrendPositive) TrendPositive else TrendNegative,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }
            }
            Column {
                Text(
                    label,
                    fontSize = 10.sp,
                    color = TextSecondary,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = 1.2.sp
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    value,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Black,
                    color = TextPrimary,
                    letterSpacing = (-1).sp
                )
            }
        }
    }
}

// ═══════════════════════════════════════════════
// 5. ANALYTICS CHART CARD
// ═══════════════════════════════════════════════
@Composable
fun AnalyticsChartCard() {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(220.dp)
            .shadow(12.dp, RoundedCornerShape(22.dp), spotColor = TradeMateTeal.copy(alpha = 0.15f)),
        colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
        shape = RoundedCornerShape(22.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column {
                    Text(
                        "ANALYTICS ENGINE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = TradeMateTeal,
                        letterSpacing = 1.2.sp
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        "Performance Metrics",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                }
                Box(
                    modifier = Modifier
                        .background(
                            Brush.horizontalGradient(listOf(TradeMateGreen.copy(alpha = 0.12f), TradeMateTeal.copy(alpha = 0.12f))),
                            RoundedCornerShape(50)
                        )
                        .padding(horizontal = 12.dp, vertical = 5.dp)
                ) {
                    Text("● LIVE", fontSize = 10.sp, color = TradeMateGreen, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(modifier = Modifier.height(16.dp))

            Canvas(modifier = Modifier.fillMaxSize()) {
                val width = size.width
                val height = size.height

                val path = Path().apply {
                    moveTo(0f, height * 0.8f)
                    cubicTo(width * 0.15f, height * 0.9f, width * 0.25f, height * 0.7f, width * 0.4f, height * 0.5f)
                    cubicTo(width * 0.5f, height * 0.35f, width * 0.6f, height * 0.4f, width * 0.7f, height * 0.25f)
                    cubicTo(width * 0.8f, height * 0.15f, width * 0.9f, height * 0.2f, width, height * 0.08f)
                }
                val fillPath = Path().apply {
                    addPath(path)
                    lineTo(width, height)
                    lineTo(0f, height)
                    close()
                }
                drawPath(
                    path = fillPath,
                    brush = Brush.verticalGradient(
                        colors = listOf(TradeMateTeal.copy(alpha = 0.30f), TradeMateTeal.copy(alpha = 0.0f)),
                        startY = 0f, endY = height
                    )
                )
                drawPath(
                    path = path,
                    brush = Brush.horizontalGradient(listOf(TradeMateTeal, TradeMateGreen)),
                    style = Stroke(width = 4.dp.toPx(), cap = StrokeCap.Round)
                )
                // End dot with glow
                drawCircle(color = TradeMateGreen.copy(alpha = 0.3f), radius = 10.dp.toPx(), center = Offset(width, height * 0.08f))
                drawCircle(color = TradeMateGreen, radius = 5.dp.toPx(), center = Offset(width, height * 0.08f))
                drawCircle(color = Color.White, radius = 2.5.dp.toPx(), center = Offset(width, height * 0.08f))
            }
        }
    }
}

// ═══════════════════════════════════════════════
// 6. PREMIUM BUTTON
// ═══════════════════════════════════════════════
@Composable
fun PremiumButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    loading: Boolean = false
) {
    Button(
        onClick = onClick,
        enabled = enabled && !loading,
        modifier = modifier.height(58.dp).fillMaxWidth(),
        colors = ButtonDefaults.buttonColors(
            containerColor = TradeMateGreen,
            contentColor = Color.White,
            disabledContainerColor = TradeMateGreen.copy(alpha = 0.4f)
        ),
        shape = RoundedCornerShape(16.dp),
        elevation = ButtonDefaults.buttonElevation(
            defaultElevation = 6.dp,
            pressedElevation = 2.dp
        )
    ) {
        if (loading) {
            CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp), strokeWidth = 2.5.dp)
        } else {
            Text(text.uppercase(), fontWeight = FontWeight.Black, fontSize = 15.sp, letterSpacing = 1.5.sp)
        }
    }
}

// ═══════════════════════════════════════════════
// 7. CLIENT DIRECTORY ITEM
// ═══════════════════════════════════════════════
@Composable
@Suppress("UNUSED_PARAMETER")
fun DirectoryItem(
    title: String,
    subtitle: String,
    status: String? = null,
    initials: String,
    onCallClick: () -> Unit = {}
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .shadow(elevation = 4.dp, shape = RoundedCornerShape(18.dp), clip = false),
        colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
        shape = RoundedCornerShape(18.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp).fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Avatar with gradient background
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(
                                TradeMateGreen.copy(alpha = 0.15f),
                                TradeMateTeal.copy(alpha = 0.10f)
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = initials.take(2).uppercase(),
                    color = TradeMateGreen,
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp
                )
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
                Spacer(modifier = Modifier.height(2.dp))
                Text(subtitle, fontSize = 13.sp, color = TextSecondary)
            }
            // Call button with gradient-tinted background
            IconButton(
                onClick = onCallClick,
                modifier = Modifier
                    .size(40.dp)
                    .background(TradeMateGreen.copy(alpha = 0.1f), CircleShape)
            ) {
                Icon(Icons.Default.Phone, null, tint = TradeMateGreen, modifier = Modifier.size(18.dp))
            }
        }
    }
}

// ═══════════════════════════════════════════════
// 8. SWIPE-TO-DELETE BACKGROUND
// ═══════════════════════════════════════════════
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SwipeToDeleteBackground(dismissState: SwipeToDismissBoxState) {
    val color = if (dismissState.dismissDirection == SwipeToDismissBoxValue.EndToStart)
        StatusOverdue.copy(alpha = 0.9f) else Color.Transparent

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(vertical = 4.dp)
            .clip(RoundedCornerShape(18.dp))
            .background(color)
            .padding(horizontal = 24.dp),
        contentAlignment = Alignment.CenterEnd
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(Icons.Default.Delete, "Delete", tint = Color.White, modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text("DELETE", fontSize = 10.sp, color = Color.White, fontWeight = FontWeight.Bold)
        }
    }
}

// ═══════════════════════════════════════════════
// 9. JOB ITEM — Premium Card
// ═══════════════════════════════════════════════
@Composable
fun JobItem(
    title: String,
    clientName: String,
    price: Double,
    status: String,
    photoUri: String?,
    onCameraClick: () -> Unit,
    onCalendarClick: () -> Unit,
    onInvoiceClick: () -> Unit,
    onPhotoClick: () -> Unit
) {
    val statusColor = when (status) {
        "Paid" -> StatusPaid
        "Active" -> StatusActive
        else -> StatusPending
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .shadow(elevation = 6.dp, shape = RoundedCornerShape(18.dp), clip = false),
        colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
        shape = RoundedCornerShape(18.dp)
    ) {
        Column {
            // Info Row
            Row(
                modifier = Modifier.padding(18.dp).fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Status indicator bar
                Box(
                    modifier = Modifier
                        .width(4.dp)
                        .height(44.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(statusColor)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
                    Spacer(modifier = Modifier.height(3.dp))
                    Text(clientName, fontSize = 13.sp, color = TextSecondary)
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        "$${String.format("%.0f", price)}",
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Box(
                        modifier = Modifier
                            .background(statusColor.copy(alpha = 0.12f), RoundedCornerShape(8.dp))
                            .padding(horizontal = 10.dp, vertical = 3.dp)
                    ) {
                        Text(
                            status.uppercase(),
                            fontSize = 10.sp,
                            color = statusColor,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = 0.5.sp
                        )
                    }
                }
            }

            // Toolbar Row
            HorizontalDivider(
                thickness = 1.dp,
                color = BackgroundLight
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(SurfaceElevated)
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Photo
                if (photoUri != null) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .clickable { onPhotoClick() }
                    ) {
                        Image(
                            painter = rememberAsyncImagePainter(photoUri),
                            contentDescription = "Proof",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                } else {
                    IconButton(onClick = onCameraClick) {
                        Icon(Icons.Outlined.CameraAlt, "Add Photo", tint = TextSecondary)
                    }
                }
                // Calendar
                IconButton(onClick = onCalendarClick) {
                    Icon(Icons.Outlined.Event, "Sync Calendar", tint = TradeMateTeal)
                }
                // Invoice
                Button(
                    onClick = onInvoiceClick,
                    colors = ButtonDefaults.buttonColors(containerColor = TextPrimary),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                    modifier = Modifier.height(34.dp)
                ) {
                    Icon(Icons.Default.Description, null, modifier = Modifier.size(14.dp), tint = Color.White)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("INVOICE", fontSize = 10.sp, color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

// ═══════════════════════════════════════════════
// 10. BOTTOM NAVIGATION BAR — Premium Floating Design
// ═══════════════════════════════════════════════
@Composable
fun BottomNavBar(navController: NavController) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    // Floating pill container
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 12.dp)
    ) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
            elevation = CardDefaults.cardElevation(defaultElevation = 12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                NavBarItem(
                    icon = Icons.Default.Home,
                    label = "Home",
                    isSelected = currentRoute == "dashboard",
                    onClick = {
                        navController.navigate("dashboard") {
                            popUpTo("dashboard") { inclusive = true }
                            launchSingleTop = true
                        }
                    }
                )
                NavBarItem(
                    icon = Icons.Default.People,
                    label = "Clients",
                    isSelected = currentRoute == "clients",
                    onClick = {
                        navController.navigate("clients") {
                            launchSingleTop = true
                        }
                    }
                )
                NavBarItem(
                    icon = Icons.Default.Work,
                    label = "Jobs",
                    isSelected = currentRoute == "jobs",
                    onClick = {
                        navController.navigate("jobs") {
                            launchSingleTop = true
                        }
                    }
                )
                NavBarItem(
                    icon = Icons.Default.Settings,
                    label = "Settings",
                    isSelected = currentRoute == "settings",
                    onClick = {
                        navController.navigate("settings") {
                            launchSingleTop = true
                        }
                    }
                )
            }
        }
    }
}

@Composable
private fun NavBarItem(
    icon: ImageVector,
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val animatedColor by animateColorAsState(
        targetValue = if (isSelected) TradeMateGreen else TextSecondary,
        label = "navColor"
    )
    val animatedScale by animateFloatAsState(
        targetValue = if (isSelected) 1.1f else 1f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy),
        label = "navScale"
    )

    Column(
        modifier = Modifier
            .clip(RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .scale(animatedScale),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(if (isSelected) 40.dp else 36.dp)
                .background(
                    if (isSelected) TradeMateGreen.copy(alpha = 0.12f) else Color.Transparent,
                    CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                icon, label,
                tint = animatedColor,
                modifier = Modifier.size(22.dp)
            )
        }
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            label,
            fontSize = 10.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = animatedColor
        )
    }
}