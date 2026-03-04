package com.aimatcher.matching_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.aimatcher.matching_service.dto.MatchResult;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    public List<MatchResult> calculateMatches(
            List<Map<String, Object>> resumes,
            Map<String, Object> job
    ) {

        // Normalize job required skills (supports multiple key names like requiredSkills / skills)
        Object rawJobSkills = job.get("requiredSkills") != null
                ? job.get("requiredSkills")
                : job.get("skills");
        List<String> jobSkills = normalizeSkills(rawJobSkills);

        List<MatchResult> results = new ArrayList<>();

        for (Map<String, Object> resume : resumes) {

            // Normalize resume skills (supports multiple key names like skills / skill)
            Object rawResumeSkills = resume.get("skills") != null
                    ? resume.get("skills")
                    : resume.get("skill");
            List<String> resumeSkills = normalizeSkills(rawResumeSkills);

            List<String> matchedList = jobSkills.stream()
                    .filter(resumeSkills::contains)
                    .collect(Collectors.toList());
            List<String> missingList = jobSkills.stream()
                    .filter(s -> !resumeSkills.contains(s))
                    .collect(Collectors.toList());

            double skillScore = jobSkills.isEmpty() ? 0.0
                    : ((double) matchedList.size() / jobSkills.size()) * 100;

            // Experience relevance
            int jobMin = 0, resumeYears = 0;
            try {
                Object o = job.get("minExperience") != null
                        ? job.get("minExperience")
                        : job.get("experience");
                if (o != null) jobMin = Integer.parseInt(o.toString());
            } catch (Exception ignored) {}
            try {
                Object o = resume.get("yearsOfExperience") != null
                        ? resume.get("yearsOfExperience")
                        : resume.get("experience");
                if (o != null) resumeYears = Integer.parseInt(o.toString());
            } catch (Exception ignored) {}

            double expBonus = (jobMin > 0 && resumeYears >= jobMin) ? 5 : (jobMin > 0 && resumeYears > 0 && resumeYears < jobMin) ? -10 : 0;
            double score = Math.max(0, Math.min(100, skillScore + expBonus));

            String candidateName = resume.get("candidateName") != null
                    ? resume.get("candidateName").toString() : "";
            String candidateEmail = resume.get("candidateEmail") != null
                    ? resume.get("candidateEmail").toString() : "";

            String matchedSkillsStr = String.join(", ", matchedList);
            String missingSkillsStr = String.join(", ", missingList);
            String explanation = buildExplanation(score, matchedSkillsStr, missingSkillsStr, jobSkills.size(), jobMin, resumeYears);

            results.add(
                    MatchResult.builder()
                            .resumeId(Long.valueOf(resume.get("id").toString()))
                            .candidateName(candidateName)
                            .candidateEmail(candidateEmail)
                            .matchScore(Math.round(score * 10) / 10.0)
                            .matchedSkills(matchedSkillsStr)
                            .missingSkills(missingSkillsStr)
                            .matchExplanation(explanation)
                            .build()
            );
        }

        results.sort((a, b) ->
                Double.compare(b.getMatchScore(), a.getMatchScore()));

        return results;
    }

    private String buildExplanation(double score, String matched, String missing, int totalRequired, int jobMin, int resumeYears) {
        StringBuilder sb = new StringBuilder();
        if (score >= 70) {
            sb.append("Strong match. ");
        } else if (score >= 40) {
            sb.append("Moderate match. ");
        } else {
            sb.append("Low match. ");
        }
        if (!matched.isEmpty()) {
            sb.append("Matched skills: ").append(matched).append(". ");
        }
        if (!missing.isEmpty()) {
            sb.append("Missing: ").append(missing).append(". ");
        }
        if (jobMin > 0 && resumeYears > 0) {
            if (resumeYears >= jobMin) sb.append("Experience OK (").append(resumeYears).append(" yrs). ");
            else sb.append("Experience below required (").append(resumeYears).append("<").append(jobMin).append(" yrs). ");
        }
        sb.append("Score based on ").append(totalRequired).append(" required skills.");
        return sb.toString();
    }

    /**
     * Normalize a skills value that may be stored as:
     * - a comma-separated String
     * - a List / Collection of Strings
     * - any other object that can be converted to String
     */
    private List<String> normalizeSkills(Object rawSkills) {
        if (rawSkills == null) {
            return new ArrayList<>();
        }

        // If it's already a collection (e.g. List<String> from controller/AI prep)
        if (rawSkills instanceof Collection<?> collection) {
            return collection.stream()
                    .filter(Objects::nonNull)
                    .map(Object::toString)
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        // Fallback: treat as a comma-separated string
        String skillsStr = rawSkills.toString();
        if (skillsStr.isBlank()) {
            return new ArrayList<>();
        }

        return Arrays.stream(skillsStr.split("[,]"))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
