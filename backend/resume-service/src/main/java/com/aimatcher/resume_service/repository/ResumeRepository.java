package com.aimatcher.resume_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aimatcher.resume_service.entity.Resume;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
}
