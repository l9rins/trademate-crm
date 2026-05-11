package com.trademate.features.job;

import com.trademate.features.job.model.Job;
import com.trademate.features.job.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByUserId(UUID userId);

    List<Job> findByUserIdAndStatus(UUID userId, JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.user.id = :userId AND j.scheduledDate BETWEEN :start AND :end")
    List<Job> findJobsForDateRange(UUID userId, LocalDateTime start, LocalDateTime end);
}
