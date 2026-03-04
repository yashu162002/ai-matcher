package com.aimatcher.resume_service.util;

import java.util.*;
import java.util.regex.Pattern;

public class SkillExtractor {

    // Canonical skill list (Proper Formatting)
    private static final List<String> SKILLS = Arrays.asList(
            "Java",
            "Spring",
            "Spring Boot",
            "React",
            "Angular",
            "MySQL",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "AWS",
            "HTML",
            "CSS",
            "JavaScript",
            "Python",
            "Hibernate",
            "JPA"
    );

    public static String extractSkills(String text) {

        if (text == null || text.isBlank()) {
            return "";
        }

        String lowerText = text.toLowerCase();
        Set<String> foundSkills = new LinkedHashSet<>(); // keeps order, removes duplicates

        for (String skill : SKILLS) {

            // Word boundary matching to prevent false matches
            String regex = "\\b" + Pattern.quote(skill.toLowerCase()) + "\\b";

            if (Pattern.compile(regex).matcher(lowerText).find()) {
                foundSkills.add(skill);
            }
        }

        return String.join(", ", foundSkills);
    }
}