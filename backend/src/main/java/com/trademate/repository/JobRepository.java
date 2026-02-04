package com.trademate.repository;

import com.trademate.model.Job;
import com.trademate.model.JobStatus;
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
