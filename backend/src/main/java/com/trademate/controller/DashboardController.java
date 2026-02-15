package com.trademate.controller;

import com.trademate.model.Job;
import com.trademate.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final JobService jobService;

    @GetMapping
    @Cacheable(value = "dashboardStats", key = "#userDetails.username")
    public Map<String, Object> getDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {
        List<Job> allJobs = jobService.getJobs(userDetails.getUsername());

        long totalJobs = allJobs.size();
        long pendingJobs = allJobs.stream().filter(j -> "PENDING".equals(j.getStatus().name())).count();
        long completedJobs = allJobs.stream().filter(j -> "COMPLETED".equals(j.getStatus().name())).count();

        LocalDate today = LocalDate.now();
        List<Job> todayJobs = allJobs.stream()
                .filter(j -> j.getScheduledDate() != null && j.getScheduledDate().toLocalDate().equals(today))
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobs", totalJobs);
        stats.put("pendingJobs", pendingJobs);
        stats.put("completedJobs", completedJobs);
        stats.put("todayJobs", todayJobs);

        return stats;
    }
}
