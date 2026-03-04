package com.aimatcher.matching.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class JobClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public Object getJob(Long jobId) {
        return restTemplate.getForObject(
                "http://localhost:8083/api/job/" + jobId,
                Object.class
        );
    }
}
