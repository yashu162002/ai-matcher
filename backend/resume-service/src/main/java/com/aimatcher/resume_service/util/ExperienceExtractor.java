package com.aimatcher.resume_service.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ExperienceExtractor {

    // Matches: "5 years", "3+ years", "10 years of experience", "2 yrs"
    private static final Pattern[] PATTERNS = {
            Pattern.compile("(\\d+)\\s*\\+?\\s*years?\\s+(?:of\\s+)?(?:experience|exp)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?:experience|exp)\\s*[:\\-]?\\s*(\\d+)\\s*years?", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(\\d+)\\s*years?\\s+(?:experience|exp)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(\\d+)\\s*yrs?", Pattern.CASE_INSENSITIVE)
    };

    public static Integer extractYears(String text) {
        if (text == null || text.isEmpty()) return null;
        for (Pattern p : PATTERNS) {
            Matcher m = p.matcher(text);
            if (m.find()) {
                try {
                    int years = Integer.parseInt(m.group(1));
                    return Math.min(years, 50); // cap at 50
                } catch (NumberFormatException ignored) {}
            }
        }
        return null;
    }
}
