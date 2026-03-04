package com.aimatcher.matching_service.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecommendedJob {
    private Long jobId;
    private String title;
    private String description;
    private Double matchScore;
    private String matchExplanation;
}
