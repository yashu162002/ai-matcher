package com.aimatcher.job_service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.aimatcher.job_service.entity.Job;
import com.aimatcher.job_service.entity.JobApplication;
import com.aimatcher.job_service.repository.JobRepository;
import com.aimatcher.job_service.service.JobApplicationService;
import com.aimatcher.job_service.service.JobService;

@RestController
@RequestMapping("/api/job")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;
    private final JobApplicationService applicationService;
    private final JobRepository jobRepository;

    // ======================================
    // CREATE JOB
    // ======================================
    @PostMapping("/create")
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        Job savedJob = jobService.createJob(job);
        return ResponseEntity.ok(savedJob);
    }

    // ======================================
    // GET ALL JOBS
    // ======================================
    @GetMapping("/all")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // ======================================
    // GET JOB BY ID (Service Layer)
    // ======================================
    @GetMapping("/service/{id}")
    public ResponseEntity<Job> getJobByIdUsingService(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    // ======================================
    // GET JOB BY ID (Direct Repository Access)
    // ======================================
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return ResponseEntity.ok(job);
    }

    // ======================================
    // DELETE JOB
    // ======================================
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {

        jobRepository.deleteById(id);

        return ResponseEntity.ok("Job deleted successfully");
    }

    // ======================================
    // SHORTLIST / REJECT CANDIDATE
    // ======================================
    @PutMapping("/{jobId}/application/{resumeId}")
    public ResponseEntity<JobApplication> shortlistOrReject(
            @PathVariable Long jobId,
            @PathVariable Long resumeId,
            @RequestParam String status) {
        JobApplication app = applicationService.shortlistOrReject(jobId, resumeId, status);
        return ResponseEntity.ok(app);
    }

    // ======================================
    // GET APPLICATIONS FOR JOB
    // ======================================
    @GetMapping("/{jobId}/applications")
    public ResponseEntity<List<JobApplication>> getApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }
}