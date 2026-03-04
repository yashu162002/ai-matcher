package com.aimatcher.job_service.service;

import com.aimatcher.job_service.entity.JobApplication;
import com.aimatcher.job_service.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;

    public JobApplication shortlistOrReject(Long jobId, Long resumeId, String status) {
        if (!"SHORTLISTED".equals(status) && !"REJECTED".equals(status)) {
            throw new IllegalArgumentException("Status must be SHORTLISTED or REJECTED");
        }
        JobApplication app = applicationRepository.findByJobIdAndResumeId(jobId, resumeId)
                .orElse(new JobApplication(jobId, resumeId, "PENDING"));
        app.setStatus(status);
        return applicationRepository.save(app);
    }

    public List<JobApplication> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }
}
