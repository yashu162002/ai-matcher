package com.aimatcher.resume_service.service;

import com.aimatcher.resume_service.entity.Resume;
import com.aimatcher.resume_service.repository.ResumeRepository;
import com.aimatcher.resume_service.util.ExperienceExtractor;
import com.aimatcher.resume_service.util.SkillExtractor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    public String uploadResume(String name,
                               String email,
                               String phoneNo,
                               String address,
                               MultipartFile file) {

        try {

            // ==============================
            // 📁 1️⃣ Create Upload Directory
            // ==============================
            String projectPath = System.getProperty("user.dir");
            String uploadDirPath = projectPath + File.separator + "uploads";

            File uploadDir = new File(uploadDirPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }




            // ==============================
            // 🔐 2️⃣ Generate Unique Filename
            // ==============================
            String originalFileName = file.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID() + "_" + originalFileName;

            String fullFilePath = uploadDirPath + File.separator + uniqueFileName;

            // ==============================
            // 💾 3️⃣ Save File
            // ==============================
            File destinationFile = new File(fullFilePath);
            file.transferTo(destinationFile);

            // ==============================
            // 🔎 4️⃣ Extract Text From PDF
            // ==============================
            String extractedText = "";

            try (PDDocument document = PDDocument.load(destinationFile)) {
                if (!document.isEncrypted()) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    extractedText = stripper.getText(document);
                }
            } catch (Exception e) {
                extractedText = "";
            }

            // 🔥 Ensure text is not null
            if (extractedText == null) {
                extractedText = "";
            }

            // Clean text
            extractedText = extractedText.trim();

            // ==============================
            // 🧠 5️⃣ Extract Skills & Experience
            // ==============================
            String extractedSkills = "";
            Integer yearsOfExperience = null;

            if (!extractedText.isBlank()) {

                extractedSkills = SkillExtractor.extractSkills(extractedText);
                yearsOfExperience = ExperienceExtractor.extractYears(extractedText);
            }

            // Fallback safety
            if (extractedSkills == null) {
                extractedSkills = "";
            }

            // ==============================
            // 🗄 6️⃣ Save To Database (truncate large fields to avoid DB limits)
            // ==============================
            Resume resume = new Resume();

            resume.setCandidateName(name != null ? name : "");
            resume.setCandidateEmail(email != null ? email : "");
            resume.setPhoneNo(phoneNo != null ? phoneNo : "");
            resume.setAddress(address != null ? address : "");
            resume.setFileName(uniqueFileName);
            resume.setFilePath(fullFilePath);
            resume.setExtractedText(truncate(extractedText, 250));
            resume.setSkills(truncate(extractedSkills, 250));
            resume.setYearsOfExperience(yearsOfExperience);

            resumeRepository.save(resume);

            return "Resume uploaded and processed successfully!";

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error uploading resume: " + e.getMessage());
        }
    }

    private String truncate(String value, int maxLength) {
        if (value == null) return null;
        if (value.length() <= maxLength) return value;
        return value.substring(0, maxLength);
    }
}