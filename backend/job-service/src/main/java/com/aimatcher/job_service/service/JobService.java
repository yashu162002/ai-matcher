package com.aimatcher.job_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import com.aimatcher.job_service.entity.Job;
import com.aimatcher.job_service.repository.JobRepository;
import com.aimatcher.job_service.util.SkillExtractor;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    // ==============================
    // CREATE JOB
    // ==============================
    public Job createJob(Job job) {

        String extractedSkills =
                SkillExtractor.extractSkills(job.getDescription());

        job.setRequiredSkills(extractedSkills);

        return jobRepository.save(job);
    }

    // ==============================
    // GET ALL JOBS
    // ==============================
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // ==============================
    // GET JOB BY ID
    // ==============================
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    // ==============================
    // DELETE JOB
    // ==============================
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
