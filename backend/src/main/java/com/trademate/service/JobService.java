package com.trademate.service;

import com.trademate.model.Job;
import com.trademate.model.JobStatus;
import com.trademate.repository.ClientRepository;
import com.trademate.repository.JobRepository;
import com.trademate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository; // Needed if linking client

    public List<Job> getJobs(String username) {
        var user = userRepository.findByUsername(username).orElseThrow();
        return jobRepository.findByUserId(user.getId());
    }

    public Job createJob(String username, Job jobRequest) {
        var user = userRepository.findByUsername(username).orElseThrow();
        jobRequest.setUser(user);

        // If client ID is passed, we should link it.
        // For MVP, assuming jobRequest has only client_id in JSON ?
        // No, JPA expects Client object. The DTO usually handles this conversion.
        // I will assume for MVP we are just saving what we get, but if client is null
        // it works.
        // If client is passed with ID only?
        // Let's implement a quick fix: if jobRequest.getClient() != null &&
        // jobRequest.getClient().getId() != null
        if (jobRequest.getClient() != null && jobRequest.getClient().getId() != null) {
            var client = clientRepository.findById(jobRequest.getClient().getId()).orElse(null);
            jobRequest.setClient(client);
        }

        jobRequest.setCreatedAt(LocalDateTime.now());
        jobRequest.setUpdatedAt(LocalDateTime.now());
        if (jobRequest.getStatus() == null) {
            jobRequest.setStatus(JobStatus.PENDING);
        }
        return jobRepository.save(jobRequest);
    }

    public Job updateJob(Long id, Job jobRequest) {
        var job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setAddress(jobRequest.getAddress());
        job.setStatus(jobRequest.getStatus());
        job.setNotes(jobRequest.getNotes());
        job.setScheduledDate(jobRequest.getScheduledDate());
        job.setUpdatedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
