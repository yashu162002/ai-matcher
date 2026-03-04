package com.aimatcher.job_service.repository;

import com.aimatcher.job_service.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByJobId(Long jobId);
    Optional<JobApplication> findByJobIdAndResumeId(Long jobId, Long resumeId);
}
