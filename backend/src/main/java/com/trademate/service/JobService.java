package com.trademate.service;

import com.trademate.exception.EntityNotFoundException;
import com.trademate.model.Job;
import com.trademate.model.JobStatus;
import com.trademate.repository.ClientRepository;
import com.trademate.repository.JobRepository;
import com.trademate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    public List<Job> getJobs(String username) {
        var user = userRepository.findByUsername(username).orElseThrow();
        return jobRepository.findByUserId(user.getId());
    }

    @CacheEvict(value = "dashboardStats", key = "#username")
    public Job createJob(String username, Job jobRequest) {
        var user = userRepository.findByUsername(username).orElseThrow();
        jobRequest.setUser(user);

        // Safe client lookup — throws 404 instead of silently passing null
        if (jobRequest.getClient() != null && jobRequest.getClient().getId() != null) {
            jobRequest.setClient(clientRepository.findById(jobRequest.getClient().getId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Client not found with ID: " + jobRequest.getClient().getId())));
        }

        jobRequest.setCreatedAt(LocalDateTime.now());
        jobRequest.setUpdatedAt(LocalDateTime.now());
        if (jobRequest.getStatus() == null) {
            jobRequest.setStatus(JobStatus.PENDING);
        }
        return jobRepository.save(jobRequest);
    }

    @CacheEvict(value = "dashboardStats", allEntries = true)
    public Job updateJob(Long id, Job jobRequest) {
        var job = jobRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Job not found with ID: " + id));
        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setAddress(jobRequest.getAddress());
        job.setStatus(jobRequest.getStatus());
        job.setNotes(jobRequest.getNotes());
        job.setScheduledDate(jobRequest.getScheduledDate());
        job.setUpdatedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }

    @CacheEvict(value = "dashboardStats", allEntries = true)
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
