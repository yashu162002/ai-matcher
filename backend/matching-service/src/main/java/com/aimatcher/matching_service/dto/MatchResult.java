package com.aimatcher.matching_service.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatchResult {

    private Long resumeId;
    private String candidateName;
    private String candidateEmail;
    private double matchScore;
    private String matchedSkills;   // e.g. "Java, Spring, React"
    private String missingSkills;    // e.g. "AWS, Docker"
    private String matchExplanation; // Why score is high/low
}
