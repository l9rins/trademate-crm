package com.trademate.features.job;

import com.trademate.features.job.model.Job;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getJobs(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(jobService.getJobs(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Job job) {
        return ResponseEntity.ok(jobService.createJob(userDetails.getUsername(), job));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id, @RequestBody Job job) {
        return ResponseEntity.ok(jobService.updateJob(userDetails.getUsername(), id, job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        jobService.deleteJob(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
