package com.aimatcher.job_service.util;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class SkillExtractor {

    private static final List<String> SKILLS = Arrays.asList(
            "Java", "Spring", "Spring Boot",
            "React", "Node", "MongoDB",
            "SQL", "PostgreSQL", "Docker",
            "AWS", "Python"
    );

    public static String extractSkills(String description) {

        if (description == null) return "";

        return SKILLS.stream()
                .filter(skill -> description.toLowerCase()
                        .contains(skill.toLowerCase()))
                .collect(Collectors.joining(", "));
    }
}
