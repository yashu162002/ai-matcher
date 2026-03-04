package com.aimatcher.resume_service.controller;

import com.aimatcher.resume_service.entity.Resume;
import com.aimatcher.resume_service.repository.ResumeRepository;
import com.aimatcher.resume_service.service.ResumeService;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService resumeService;
    private final ResumeRepository resumeRepository;

    // ✅ Manual Constructor Injection (No Lombok)
    public ResumeController(ResumeService resumeService,
                            ResumeRepository resumeRepository) {
        this.resumeService = resumeService;
        this.resumeRepository = resumeRepository;
    }

    // ==========================================
    // UPLOAD RESUME
    // ==========================================
    @PostMapping("/upload")
    public ResponseEntity<String> uploadResume(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phoneNo") String phoneNo,
            @RequestParam("address") String address,
            @RequestParam("file") MultipartFile file) {

        String response = resumeService.uploadResume(name, email, phoneNo, address, file);
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // GET ALL RESUMES
    // ==========================================
    @GetMapping("/all")
    public ResponseEntity<List<Resume>> getAllResumes() {
        return ResponseEntity.ok(resumeRepository.findAll());
    }

    // ==========================================
    // GET RESUME BY ID
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResumeById(@PathVariable Long id) {

        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        return ResponseEntity.ok(resume);
    }

    // ==========================================
    // DOWNLOAD RESUME FILE
    // ==========================================
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id) {

        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        File file = new File(resume.getFilePath());
        if (!file.exists()) {
            throw new RuntimeException("Resume file not found");
        }

        Resource resource = new FileSystemResource(file);
        String filename = resume.getFileName() != null ? resume.getFileName() : "resume.pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    // ==========================================
    // DELETE RESUME
    // ==========================================
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable Long id) {

        resumeRepository.deleteById(id);

        return ResponseEntity.ok("Resume deleted successfully");
    }
}