package com.l9rins.trademate

// --- IMPORTS ---
import android.content.Context
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.core.content.FileProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.l9rins.trademate.data.Client
import com.l9rins.trademate.data.Job
import com.l9rins.trademate.data.SessionManager
import com.l9rins.trademate.ui.theme.*
import java.io.File
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

// ═══════════════════════════════════════════════
//  DASHBOARD SCREEN
// ═══════════════════════════════════════════════
@Composable
fun DashboardScreen(viewModel: JobViewModel = viewModel()) {
    val activeCount by viewModel.statsActive.collectAsState()
    val pendingCount by viewModel.statsPending.collectAsState()
    val completedCount by viewModel.statsCompleted.collectAsState()
    val revenue by viewModel.statsRevenue.collectAsState()

    // Time-based greeting
    val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
    val greeting = when {
        hour < 12 -> "Good Morning"
        hour < 17 -> "Good Afternoon"
        else -> "Good Evening"
    }

    Box(modifier = Modifier.fillMaxSize()) {
        AnimatedGradientBackground()

        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(horizontal = 24.dp),
            contentPadding = PaddingValues(top = 48.dp, bottom = 100.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Header
            item {
                Column {
                    Text(
                        text = "WORKSPACE VITALITY",
                        fontSize = 10.sp,
                        color = TradeMateTeal,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = buildAnnotatedString {
                            append("$greeting, ")
                            withStyle(style = SpanStyle(color = TradeMateGreen)) {
                                append("BOSS")
                            }
                        },
                        fontSize = 30.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = (-1).sp,
                        color = TextPrimary
                    )
                }
            }

            // Analytics Chart
            item { AnalyticsChartCard() }

            // Stats Row 1
            item {
                Row(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                    StatCard(
                        Modifier.weight(1f),
                        Icons.Outlined.WorkOutline,
                        "ACTIVE JOBS",
                        "$activeCount",
                        "LIVE",
                        true
                    )
                    StatCard(
                        Modifier.weight(1f),
                        Icons.Default.Schedule,
                        "PENDING",
                        "$pendingCount",
                        "WAITING",
                        false
                    )
                }
            }

            // Stats Row 2
            item {
                Row(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                    StatCard(
                        Modifier.weight(1f),
                        Icons.Outlined.MonetizationOn,
                        "REVENUE",
                        "$${String.format("%.0f", revenue)}",
                        "PAID",
                        true
                    )
                    StatCard(
                        Modifier.weight(1f),
                        Icons.Outlined.CheckCircle,
                        "COMPLETED",
                        "$completedCount",
                        "DONE",
                        true
                    )
                }
            }
        }
    }
}

// ═══════════════════════════════════════════════
//  JOB SCREEN
// ═══════════════════════════════════════════════
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JobScreen(viewModel: JobViewModel = viewModel(), clientViewModel: ClientViewModel = viewModel()) {
    val jobs by viewModel.allJobs.collectAsState()
    val clients by clientViewModel.allClients.collectAsState()
    var showAddJob by remember { mutableStateOf(false) }
    val context = LocalContext.current

    // Camera Handlers
    var tempPhotoUri by remember { mutableStateOf<Uri?>(null) }
    var jobToUpdate by remember { mutableStateOf<Job?>(null) }

    val cameraLauncher = rememberLauncherForActivityResult(ActivityResultContracts.TakePicture()) { success ->
        if (success && jobToUpdate != null && tempPhotoUri != null) {
            viewModel.updateJob(jobToUpdate!!.copy(photoUri = tempPhotoUri.toString()))
        }
    }

    // Selected filter tab
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "Active", "Pending", "Paid")
    val filteredJobs = if (selectedFilter == "All") jobs else jobs.filter { it.status == selectedFilter }

    Box(modifier = Modifier.fillMaxSize().background(BackgroundLight)) {
        LazyColumn(
            modifier = Modifier.padding(horizontal = 24.dp),
            contentPadding = PaddingValues(top = 48.dp, bottom = 100.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header
            item {
                Column {
                    Text(
                        "REVENUE PIPELINE",
                        fontSize = 10.sp,
                        color = TradeMateTeal,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        "JOB BOARD",
                        fontSize = 30.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = (-1).sp,
                        color = TextPrimary
                    )
                }
            }

            // Filter Chips
            item {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    filters.forEach { filter ->
                        FilterChip(
                            selected = filter == selectedFilter,
                            onClick = { selectedFilter = filter },
                            label = {
                                Text(
                                    filter,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = TradeMateGreen.copy(alpha = 0.15f),
                                selectedLabelColor = TradeMateGreen
                            ),
                            shape = RoundedCornerShape(12.dp)
                        )
                    }
                }
            }

            // Add Button
            item {
                Button(
                    onClick = { showAddJob = true },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = TextPrimary),
                    shape = RoundedCornerShape(16.dp),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp)
                ) {
                    Icon(Icons.Default.Add, null, tint = TradeMateGreen)
                    Spacer(modifier = Modifier.width(12.dp))
                    Text("New Contract", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.White)
                }
            }

            // Job List
            if (filteredJobs.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier.fillMaxWidth().height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Outlined.WorkOutline, null, tint = TextTertiary, modifier = Modifier.size(48.dp))
                            Spacer(modifier = Modifier.height(12.dp))
                            Text("No jobs found", color = TextSecondary, fontWeight = FontWeight.Medium)
                        }
                    }
                }
            } else {
                items(filteredJobs.size) { index ->
                    val job = filteredJobs[index]
                    DirectoryJobItem(job, viewModel, context) { selectedJob ->
                        val imagesDir = File(context.filesDir, "job_photos")
                        if (!imagesDir.exists()) imagesDir.mkdirs()
                        val file = File(imagesDir, "job_${selectedJob.id}_${System.currentTimeMillis()}.jpg")
                        val uri = FileProvider.getUriForFile(context, "${context.packageName}.provider", file)
                        tempPhotoUri = uri
                        jobToUpdate = selectedJob
                        cameraLauncher.launch(uri)
                    }
                }
            }
        }

        if (showAddJob) {
            AddJobDialog(
                clients = clients,
                onDismiss = { showAddJob = false },
                onConfirm = { t, c, p, s, d ->
                    viewModel.addJob(t, c, p, s, d)
                    showAddJob = false
                }
            )
        }
    }
}

// ═══════════════════════════════════════════════
//  CLIENT SCREEN
// ═══════════════════════════════════════════════
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DirectoryScreen(
    titleMain: String,
    titleHighlight: String,
    subtitle: String,
    buttonText: String,
    viewModel: ClientViewModel = viewModel()
) {
    val clients by viewModel.filteredClients.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize().background(BackgroundLight)) {
        LazyColumn(
            modifier = Modifier.padding(horizontal = 24.dp),
            contentPadding = PaddingValues(top = 48.dp, bottom = 100.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header
            item {
                Column {
                    Text(
                        subtitle.uppercase(),
                        fontSize = 10.sp,
                        color = TradeMateTeal,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        buildAnnotatedString {
                            append("$titleMain ")
                            withStyle(SpanStyle(color = TradeMateGreen)) { append(titleHighlight) }
                        },
                        fontSize = 30.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = (-1).sp,
                        color = TextPrimary
                    )
                }
            }

            // Search bar
            item {
                Card(
                    modifier = Modifier.fillMaxWidth().height(54.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
                    elevation = CardDefaults.cardElevation(3.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Search, null, tint = TextTertiary)
                        Spacer(modifier = Modifier.width(12.dp))
                        SearchTextField(
                            value = searchQuery,
                            onValueChange = { viewModel.searchQuery.value = it },
                            modifier = Modifier.weight(1f)
                        ) {
                            if (searchQuery.isEmpty()) {
                                Text("Search clients...", color = TextTertiary)
                            }
                            it()
                        }
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { viewModel.searchQuery.value = "" }) {
                                Icon(Icons.Default.Clear, null, tint = TextSecondary, modifier = Modifier.size(18.dp))
                            }
                        }
                    }
                }
            }

            // Add button
            item {
                Button(
                    onClick = { showAddDialog = true },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = TextPrimary),
                    shape = RoundedCornerShape(16.dp),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp)
                ) {
                    Icon(Icons.Default.Add, null, tint = TradeMateGreen)
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(buttonText, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.White)
                }
            }

            // Client List
            if (clients.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier.fillMaxWidth().height(200.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Outlined.PersonAdd, null, tint = TextTertiary, modifier = Modifier.size(48.dp))
                            Spacer(modifier = Modifier.height(12.dp))
                            Text("No clients yet", color = TextSecondary, fontWeight = FontWeight.Medium)
                        }
                    }
                }
            } else {
                items(clients.size) { index ->
                    val client = clients[index]
                    DirectoryClientItem(client, viewModel)
                }
            }
        }
        if (showAddDialog) {
            AddClientDialog(
                { showAddDialog = false },
                { n, e, p -> viewModel.addClient(n, e, p); showAddDialog = false }
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DirectoryClientItem(client: Client, viewModel: ClientViewModel) {
    val dismissState = rememberSwipeToDismissBoxState(
        confirmValueChange = {
            if (it == SwipeToDismissBoxValue.EndToStart) { viewModel.deleteClient(client); true } else false
        }
    )
    SwipeToDismissBox(
        state = dismissState,
        backgroundContent = { SwipeToDeleteBackground(dismissState) }
    ) {
        DirectoryItem(
            title = client.name,
            subtitle = client.email,
            initials = client.name,
            status = "Active",
            onCallClick = { viewModel.makeCall(client.phone) }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DirectoryJobItem(
    job: Job,
    viewModel: JobViewModel,
    context: Context,
    onCameraClick: (Job) -> Unit
) {
    val dismissState = rememberSwipeToDismissBoxState(
        confirmValueChange = {
            if (it == SwipeToDismissBoxValue.EndToStart) { viewModel.deleteJob(job); true } else false
        }
    )
    SwipeToDismissBox(
        state = dismissState,
        backgroundContent = { SwipeToDeleteBackground(dismissState) }
    ) {
        JobItem(
            title = job.title,
            clientName = job.clientName,
            price = job.price,
            status = job.status,
            photoUri = job.photoUri,
            onCameraClick = { onCameraClick(job) },
            onCalendarClick = { viewModel.addToCalendar(context, job) },
            onInvoiceClick = { viewModel.shareInvoice(context, job) },
            onPhotoClick = { /* View full image */ }
        )
    }
}

// ═══════════════════════════════════════════════
//  ADD JOB DIALOG
// ═══════════════════════════════════════════════
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddJobDialog(
    clients: List<Client>,
    onDismiss: () -> Unit,
    onConfirm: (String, String, Double, String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var price by remember { mutableStateOf("") }
    var expanded by remember { mutableStateOf(false) }
    var selectedClient by remember { mutableStateOf("") }
    val statuses = listOf("Pending", "Active", "Paid")
    var selectedStatus by remember { mutableStateOf("Active") }

    // Date Picker
    var showDatePicker by remember { mutableStateOf(false) }
    var selectedDateMillis by remember { mutableStateOf(System.currentTimeMillis()) }
    val dateState = rememberDatePickerState(initialSelectedDateMillis = selectedDateMillis)

    fun formatDate(millis: Long): String {
        return SimpleDateFormat("MMM dd, yyyy", Locale.getDefault()).format(Date(millis))
    }

    if (showDatePicker) {
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    selectedDateMillis = dateState.selectedDateMillis ?: System.currentTimeMillis()
                    showDatePicker = false
                }) { Text("OK", color = TradeMateGreen, fontWeight = FontWeight.Bold) }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) { Text("Cancel") }
            }
        ) {
            DatePicker(state = dateState)
        }
    }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
            elevation = CardDefaults.cardElevation(defaultElevation = 16.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header
                Icon(Icons.Outlined.WorkOutline, null, tint = TradeMateGreen, modifier = Modifier.size(32.dp))
                Spacer(modifier = Modifier.height(8.dp))
                Text("New Contract", fontSize = 22.sp, fontWeight = FontWeight.Black, color = TextPrimary)
                Spacer(modifier = Modifier.height(20.dp))

                // Job Title
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Job Title") },
                    leadingIcon = { Icon(Icons.Outlined.Edit, null, tint = TextSecondary, modifier = Modifier.size(20.dp)) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TradeMateGreen,
                        focusedLabelColor = TradeMateGreen,
                        cursorColor = TradeMateGreen
                    )
                )
                Spacer(modifier = Modifier.height(12.dp))

                // Client Selector
                Box(modifier = Modifier.fillMaxWidth()) {
                    OutlinedTextField(
                        value = selectedClient,
                        onValueChange = {},
                        label = { Text("Select Client") },
                        leadingIcon = { Icon(Icons.Outlined.Person, null, tint = TextSecondary, modifier = Modifier.size(20.dp)) },
                        modifier = Modifier.fillMaxWidth(),
                        readOnly = true,
                        shape = RoundedCornerShape(14.dp),
                        trailingIcon = {
                            IconButton(onClick = { expanded = true }) {
                                Icon(Icons.Default.ArrowDropDown, null)
                            }
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = TradeMateGreen,
                            focusedLabelColor = TradeMateGreen
                        )
                    )
                    Box(modifier = Modifier.matchParentSize().clickable { expanded = true })
                    DropdownMenu(
                        expanded = expanded,
                        onDismissRequest = { expanded = false },
                        modifier = Modifier.background(SurfaceWhite)
                    ) {
                        if (clients.isEmpty()) {
                            DropdownMenuItem(
                                text = { Text("No clients yet — add one first.") },
                                onClick = { expanded = false }
                            )
                        } else {
                            clients.forEach { client ->
                                DropdownMenuItem(
                                    text = { Text(client.name) },
                                    onClick = { selectedClient = client.name; expanded = false }
                                )
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))

                // Price
                OutlinedTextField(
                    value = price,
                    onValueChange = { price = it },
                    label = { Text("Price (\$)") },
                    leadingIcon = { Icon(Icons.Outlined.MonetizationOn, null, tint = TextSecondary, modifier = Modifier.size(20.dp)) },
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    shape = RoundedCornerShape(14.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TradeMateGreen,
                        focusedLabelColor = TradeMateGreen,
                        cursorColor = TradeMateGreen
                    )
                )
                Spacer(modifier = Modifier.height(12.dp))

                // Date Picker
                Box(modifier = Modifier.fillMaxWidth()) {
                    OutlinedTextField(
                        value = formatDate(selectedDateMillis),
                        onValueChange = {},
                        label = { Text("Due Date") },
                        leadingIcon = { Icon(Icons.Outlined.CalendarToday, null, tint = TextSecondary, modifier = Modifier.size(20.dp)) },
                        modifier = Modifier.fillMaxWidth(),
                        readOnly = true,
                        shape = RoundedCornerShape(14.dp),
                        trailingIcon = {
                            IconButton(onClick = { showDatePicker = true }) {
                                Icon(Icons.Default.CalendarToday, null, tint = TradeMateGreen)
                            }
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = TradeMateGreen,
                            focusedLabelColor = TradeMateGreen
                        )
                    )
                    Box(modifier = Modifier.matchParentSize().clickable { showDatePicker = true })
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Status Chips
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    statuses.forEach { status ->
                        val statusColor = when (status) {
                            "Paid" -> StatusPaid
                            "Active" -> StatusActive
                            else -> StatusPending
                        }
                        FilterChip(
                            selected = status == selectedStatus,
                            onClick = { selectedStatus = status },
                            label = { Text(status, fontWeight = FontWeight.Bold) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = statusColor.copy(alpha = 0.15f),
                                selectedLabelColor = statusColor
                            ),
                            shape = RoundedCornerShape(10.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(24.dp))

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f).height(50.dp),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Text("Cancel")
                    }
                    Button(
                        onClick = {
                            if (title.isNotBlank() && price.isNotBlank() && selectedClient.isNotBlank()) {
                                onConfirm(title, selectedClient, price.toDoubleOrNull() ?: 0.0, selectedStatus, formatDate(selectedDateMillis))
                            }
                        },
                        modifier = Modifier.weight(1f).height(50.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = TradeMateGreen),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Text("Create", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

// ═══════════════════════════════════════════════
//  ADD CLIENT DIALOG
// ═══════════════════════════════════════════════
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddClientDialog(onDismiss: () -> Unit, onConfirm: (String, String, String) -> Unit) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
            elevation = CardDefaults.cardElevation(defaultElevation = 16.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(Icons.Outlined.PersonAdd, null, tint = TradeMateGreen, modifier = Modifier.size(32.dp))
                Spacer(modifier = Modifier.height(8.dp))
                Text("Add Client", fontSize = 22.sp, fontWeight = FontWeight.Black, color = TextPrimary)
                Spacer(modifier = Modifier.height(20.dp))

                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Full Name") },
                    leadingIcon = { Icon(Icons.Outlined.Person, null, tint = TextSecondary, modifier = Modifier.size(20.dp)) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TradeMateGreen,
                        focusedLabelColor = TradeMateGreen,
                        cursorColor = TradeMateGreen
                    )
                )
                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email Address") },
                    leadingIcon = { Icon(Icons.Outlined.Email, null, tint = TextSecondary, modifier = Modifier.size(20.dp)) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TradeMateGreen,
                        focusedLabelColor = TradeMateGreen,
                        cursorColor = TradeMateGreen
                    )
                )
                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Phone Number") },
                    leadingIcon = { Icon(Icons.Outlined.Phone, null, tint = TextSecondary, modifier = Modifier.size(20.dp)) },
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    shape = RoundedCornerShape(14.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TradeMateGreen,
                        focusedLabelColor = TradeMateGreen,
                        cursorColor = TradeMateGreen
                    )
                )
                Spacer(modifier = Modifier.height(24.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f).height(50.dp),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Text("Cancel")
                    }
                    Button(
                        onClick = { if (name.isNotBlank()) onConfirm(name, email, phone) },
                        modifier = Modifier.weight(1f).height(50.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = TradeMateGreen),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Text("Create", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

// ═══════════════════════════════════════════════
//  CLIENT SCREEN WRAPPER
// ═══════════════════════════════════════════════
@Composable
fun ClientScreen(viewModel: ClientViewModel) {
    DirectoryScreen(
        titleMain = "CLIENT",
        titleHighlight = "DIRECTORY",
        subtitle = "MANAGE YOUR CUSTOMERS",
        buttonText = "ADD CLIENT",
        viewModel = viewModel
    )
}

// ═══════════════════════════════════════════════
//  SETTINGS SCREEN (now takes NavController for logout)
// ═══════════════════════════════════════════════
@Composable
fun SettingsScreen(navController: NavController? = null) {
    val context = LocalContext.current
    val sessionManager = remember { SessionManager(context) }
    var baseUrl by remember { mutableStateOf(sessionManager.getBaseUrl()) }
    var isMockMode by remember { mutableStateOf(sessionManager.isMockMode()) }

    Box(modifier = Modifier.fillMaxSize().background(BackgroundLight)) {
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(horizontal = 24.dp),
            contentPadding = PaddingValues(top = 48.dp, bottom = 100.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header
            item {
                Column {
                    Text(
                        "SYSTEM CONTROL",
                        fontSize = 10.sp,
                        color = TradeMateTeal,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        buildAnnotatedString {
                            append("SETTINGS ")
                            withStyle(SpanStyle(color = TradeMateGreen)) { append("PANEL") }
                        },
                        fontSize = 30.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = (-1).sp,
                        color = TextPrimary
                    )
                }
            }

            // Network Section
            item {
                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceWhite),
                    elevation = CardDefaults.cardElevation(4.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text(
                            "NETWORK",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = TradeMateTeal,
                            letterSpacing = 1.2.sp
                        )
                        Spacer(modifier = Modifier.height(16.dp))

                        // Mock Mode Toggle
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(
                                        if (isMockMode) TradeMateGreen.copy(alpha = 0.12f)
                                        else BackgroundLight
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    Icons.Outlined.Science,
                                    null,
                                    tint = if (isMockMode) TradeMateGreen else TextSecondary,
                                    modifier = Modifier.size(22.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(14.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Mock Mode", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                Text("Bypass network for testing", fontSize = 12.sp, color = TextSecondary)
                            }
                            Switch(
                                checked = isMockMode,
                                onCheckedChange = { isMockMode = it },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = Color.White,
                                    checkedTrackColor = TradeMateGreen
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))
                        HorizontalDivider(color = CardBorder)
                        Spacer(modifier = Modifier.height(16.dp))

                        // API Base URL
                        Text("API BASE URL", fontSize = 10.sp, fontWeight = FontWeight.ExtraBold, color = TextSecondary, letterSpacing = 1.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = baseUrl,
                            onValueChange = { baseUrl = it },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(14.dp),
                            placeholder = { Text("https://trademate-api-a19e.onrender.com/") },
                            singleLine = true,
                            enabled = !isMockMode,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = TradeMateGreen,
                                focusedLabelColor = TradeMateGreen,
                                cursorColor = TradeMateGreen
                            )
                        )
                        if (isMockMode) {
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                "⚡ Mock mode overrides network URL",
                                fontSize = 11.sp,
                                color = TradeMateGreen,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
            }

            // Save Button
            item {
                Button(
                    onClick = {
                        sessionManager.setMockMode(isMockMode)
                        if (!isMockMode && baseUrl.isNotBlank()) {
                            sessionManager.saveBaseUrl(baseUrl)
                        }
                        Toast.makeText(context, "Settings Applied ✓", Toast.LENGTH_SHORT).show()
                    },
                    modifier = Modifier.fillMaxWidth().height(54.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = TradeMateGreen),
                    shape = RoundedCornerShape(16.dp),
                    elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp)
                ) {
                    Icon(Icons.Default.Save, null, tint = Color.White, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Save Configuration", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }

            // Logout Button
            item {
                OutlinedButton(
                    onClick = {
                        sessionManager.logout()
                        navController?.navigate("auth") {
                            popUpTo(0) { inclusive = true }
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(54.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = StatusOverdue),
                    border = androidx.compose.foundation.BorderStroke(1.5.dp, StatusOverdue.copy(alpha = 0.5f))
                ) {
                    Icon(Icons.Default.ExitToApp, null, tint = StatusOverdue, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Logout", fontWeight = FontWeight.Bold, color = StatusOverdue)
                }
            }

            // App Info
            item {
                Column(
                    modifier = Modifier.fillMaxWidth().padding(top = 16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("TradeMate CRM", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
                    Text("v1.0.0 • Built with ♥", fontSize = 11.sp, color = TextTertiary)
                }
            }
        }
    }
}

// ═══════════════════════════════════════════════
//  SEARCH TEXT FIELD
// ═══════════════════════════════════════════════
@Composable
fun SearchTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    decorationBox: @Composable (innerTextField: @Composable () -> Unit) -> Unit
) {
    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier,
        singleLine = true,
        decorationBox = decorationBox,
        textStyle = androidx.compose.ui.text.TextStyle(
            color = TextPrimary,
            fontSize = 16.sp
        )
    )
}