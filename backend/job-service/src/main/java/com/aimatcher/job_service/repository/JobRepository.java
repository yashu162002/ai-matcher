package com.aimatcher.job_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aimatcher.job_service.entity.Job;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
}
