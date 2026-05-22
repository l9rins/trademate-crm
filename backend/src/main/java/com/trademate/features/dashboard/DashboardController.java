package com.trademate.features.dashboard;

import com.trademate.features.job.model.Job;
import com.trademate.features.job.model.JobStatus;
import com.trademate.features.auth.UserRepository;
import com.trademate.features.client.ClientRepository;
import com.trademate.features.job.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ClientRepository clientRepository;

    @GetMapping
    @Cacheable(value = "dashboardStats", key = "#userDetails.username")
    public Map<String, Object> getDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("User not authenticated");
        }
        var user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        var userId = user.getId();

        LocalDate today = LocalDate.now();
        List<Job> todayJobs = jobRepository.findJobsForDateRange(
                userId,
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay());

        long totalJobs = jobRepository.countByUserId(userId);
        long pendingJobs = jobRepository.countByUserIdAndStatus(userId, JobStatus.PENDING);
        long completedJobs = jobRepository.countByUserIdAndStatus(userId, JobStatus.COMPLETED);
        long totalClients = clientRepository.countByUserId(userId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobs", totalJobs);
        stats.put("pendingJobs", pendingJobs);
        stats.put("completedJobs", completedJobs);
        stats.put("todayJobs", todayJobs);
        stats.put("totalClients", totalClients);

        return stats;
    }
}
