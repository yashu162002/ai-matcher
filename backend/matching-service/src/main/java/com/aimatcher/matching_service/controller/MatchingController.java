package com.aimatcher.matching_service.controller;

import com.aimatcher.matching_service.dto.MatchResult;
import com.aimatcher.matching_service.dto.RecommendedJob;
import com.aimatcher.matching_service.service.MatchingService;
import com.aimatcher.matching_service.service.EmailService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/match")
@CrossOrigin(origins = "http://localhost:5173")   // ✅ FIXES CORS
@RequiredArgsConstructor
public class MatchingController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final MatchingService matchingService;
    private final EmailService emailService;

    // ======================================
    // 🔹 AI MATCHING ENDPOINT
    // ======================================
    @PostMapping("/ai/{jobId}")
    public ResponseEntity<?> matchWithAI(@PathVariable Long jobId) {

        try {
            // 1️⃣ Fetch resumes
            Map[] resumeArray = restTemplate.getForObject(
                    "http://localhost:8082/api/resume/all",
                    Map[].class
            );

            List<Map<String, Object>> resumes = new ArrayList<>();

            if (resumeArray != null) {
                for (Map r : resumeArray) {
                    resumes.add((Map<String, Object>) r);
                }
            }

            // 2️⃣ Fetch job
            Map<String, Object> job = restTemplate.getForObject(
                    "http://localhost:8083/api/job/" + jobId,
                    Map.class
            );

            if (job == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Job not found"));
            }

            // ======================================
            // 🔥 CLEAN & CONVERT DATA FOR AI
            // ======================================

            // Convert resume skills safely
            for (Map<String, Object> resume : resumes) {

                Object skillsObj = resume.get("skills");

                if (skillsObj == null) {
                    resume.put("skills", new ArrayList<>());
                    continue;
                }

                if (skillsObj instanceof String skillsStr) {

                    if (skillsStr.isBlank()
                            || skillsStr.equalsIgnoreCase("Not extracted yet")) {

                        resume.put("skills", new ArrayList<>());
                        continue;
                    }

                    List<String> skillsList =
                            Arrays.stream(skillsStr.split(","))
                                    .map(String::trim)
                                    .filter(s -> !s.isEmpty())
                                    .collect(Collectors.toList());

                    resume.put("skills", skillsList);
                }
            }

            // Convert job requiredSkills safely
            Object requiredSkillsObj = job.get("requiredSkills");

            if (requiredSkillsObj == null) {
                job.put("requiredSkills", new ArrayList<>());
            } else if (requiredSkillsObj instanceof String requiredSkillsStr) {

                if (requiredSkillsStr.isBlank()) {
                    job.put("requiredSkills", new ArrayList<>());
                } else {
                    List<String> requiredSkillsList =
                            Arrays.stream(requiredSkillsStr.split(","))
                                    .map(String::trim)
                                    .filter(s -> !s.isEmpty())
                                    .collect(Collectors.toList());

                    job.put("requiredSkills", requiredSkillsList);
                }
            }

            // ======================================
            // 🤖 CALL AI SERVICE
            // ======================================
            try {

                Map<String, Object> request = new HashMap<>();
                request.put("resumes", resumes);
                request.put("job", job);

                Object aiResponse = restTemplate.postForObject(
                        "http://localhost:8000/match",
                        request,
                        Object.class
                );

                return ResponseEntity.ok(aiResponse);

            } catch (ResourceAccessException e) {

                System.out.println("AI service not reachable. Using fallback.");

                List<MatchResult> results =
                        matchingService.calculateMatches(resumes, job);

                return ResponseEntity.ok(results);

            } catch (Exception e) {

                System.out.println("AI error: " + e.getMessage());

                List<MatchResult> results =
                        matchingService.calculateMatches(resumes, job);

                return ResponseEntity.ok(results);
            }

        } catch (ResourceAccessException e) {

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error",
                            "Resume Service (8082) or Job Service (8083) not running"));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            e.getMessage() != null ? e.getMessage() : "Internal error"));
        }
    }

    // ======================================
    // 🔹 RECOMMENDED JOBS
    // ======================================
    @GetMapping("/recommend")
    public ResponseEntity<?> getRecommendedJobs(@RequestParam String email) {

        try {

            Map[] resumeArray = restTemplate.getForObject(
                    "http://localhost:8082/api/resume/all",
                    Map[].class
            );

            Map[] jobArray = restTemplate.getForObject(
                    "http://localhost:8083/api/job/all",
                    Map[].class
            );

            List<Map<String, Object>> allResumes = new ArrayList<>();
            List<Map<String, Object>> jobs = new ArrayList<>();

            if (resumeArray != null) {
                for (Map r : resumeArray) {
                    allResumes.add((Map<String, Object>) r);
                }
            }

            if (jobArray != null) {
                for (Map j : jobArray) {
                    jobs.add((Map<String, Object>) j);
                }
            }

            List<Map<String, Object>> candidateResumes =
                    allResumes.stream()
                            .filter(r -> email.equalsIgnoreCase(
                                    (String) r.get("candidateEmail")))
                            .collect(Collectors.toList());

            List<RecommendedJob> recommended = new ArrayList<>();

            for (Map<String, Object> job : jobs) {

                double bestScore = 0;
                String bestExplanation = "";

                for (Map<String, Object> resume : candidateResumes) {

                    List<MatchResult> matches =
                            matchingService.calculateMatches(
                                    Collections.singletonList(resume), job);

                    if (!matches.isEmpty()
                            && matches.get(0).getMatchScore() > bestScore) {

                        bestScore = matches.get(0).getMatchScore();
                        bestExplanation =
                                matches.get(0).getMatchExplanation() != null
                                        ? matches.get(0).getMatchExplanation()
                                        : "";
                    }
                }

                recommended.add(RecommendedJob.builder()
                        .jobId(Long.valueOf(job.get("id").toString()))
                        .title((String) job.get("title"))
                        .description((String) job.get("description"))
                        .matchScore(bestScore)
                        .matchExplanation(bestExplanation)
                        .build());
            }

            recommended.sort((a, b) ->
                    Double.compare(b.getMatchScore(), a.getMatchScore()));

            return ResponseEntity.ok(recommended);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            e.getMessage() != null ? e.getMessage() : "Internal error"));
        }
    }


    // ======================================
    // 🔹 SEND RECOMMENDED JOBS EMAIL
    // ======================================
    @PostMapping("/send-mail/{email}")
    public ResponseEntity<?> sendRecommendedJobsMail(@PathVariable String email) {

        try {

            // fetch resumes
            Map[] resumeArray = restTemplate.getForObject(
                    "http://localhost:8082/api/resume/all",
                    Map[].class
            );

            // fetch jobs
            Map[] jobArray = restTemplate.getForObject(
                    "http://localhost:8083/api/job/all",
                    Map[].class
            );

            List<Map<String, Object>> resumes =
                    resumeArray != null ? Arrays.asList(resumeArray) : new ArrayList<>();

            List<Map<String, Object>> jobs =
                    jobArray != null ? Arrays.asList(jobArray) : new ArrayList<>();


            // filter candidate resume
            List<Map<String, Object>> candidateResumes =
                    resumes.stream()
                            .filter(r -> email.equalsIgnoreCase(
                                    (String) r.get("candidateEmail")))
                            .toList();

            if (candidateResumes.isEmpty()) {
                return ResponseEntity.ok("No resume found for candidate");
            }


            List<String> matchedJobs = new ArrayList<>();


            for (Map<String, Object> job : jobs) {

                List<MatchResult> matches =
                        matchingService.calculateMatches(candidateResumes, job);

                if (!matches.isEmpty() && matches.get(0).getMatchScore() >= 60) {

                    matchedJobs.add(
                            job.get("title") + " (Match: "
                                    + matches.get(0).getMatchScore() + "%)"
                    );
                }
            }


            if (matchedJobs.isEmpty()) {
                return ResponseEntity.ok("No suitable jobs found");
            }


            String jobList = String.join("\n", matchedJobs);


            emailService.sendRecommendedJobsEmail(email, jobList);

            return ResponseEntity.ok("Mail sent successfully");

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error sending email: " + e.getMessage());
        }
    }
}