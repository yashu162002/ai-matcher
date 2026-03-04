package com.aimatcher.matching.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ResumeClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public Object[] getAllResumes() {
        return restTemplate.getForObject(
                "http://localhost:8082/api/resume/all",
                Object[].class
        );
    }
}
