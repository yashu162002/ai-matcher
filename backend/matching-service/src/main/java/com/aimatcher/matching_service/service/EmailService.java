package com.aimatcher.matching_service.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    /**
     * Send job recommendations email with Nike-inspired design
     */
    public void sendRecommendedJobsEmail(String toEmail, String candidateName, List<Map<String, Object>> jobs) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("⚡ AI Matcher – Your Personalized Job Matches");
            helper.setFrom("noreply@aimatcher.com", "AI Matcher Talent Team");

            // Prepare template context
            Context context = new Context();
            context.setVariable("candidateName", candidateName != null ? candidateName : "there");
            context.setVariable("jobs", jobs);
            context.setVariable("currentYear", java.time.Year.now().getValue());

            // Generate HTML content
            String htmlContent = generateNikeStyleEmail(context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Successfully sent job recommendations email to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Email sending failed", e);
        }
    }

    /**
     * Generate Nike-inspired email template
     */
    private String generateNikeStyleEmail(Context context) {
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Matcher - Job Recommendations</title>
            <style>
                /* Reset styles */
                body, p, h1, h2, h3, h4, h5, h6 {
                    margin: 0;
                    padding: 0;
                }
                
                /* Nike-inspired typography */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background: linear-gradient(135deg, #f6f8fc 0%, #f0f4fa 100%);
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    margin: 0;
                    padding: 0;
                }
                
                /* Main container */
                .email-wrapper {
                    max-width: 600px;
                    margin: 40px auto;
                    background: #ffffff;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
                    position: relative;
                }
                
                /* Nike-inspired top gradient */
                .header-gradient {
                    height: 6px;
                    background: linear-gradient(90deg, #2563eb 0%, #10b981 50%, #8b5cf6 100%);
                }
                
                /* Header section */
                .header {
                    padding: 40px 40px 20px 40px;
                    position: relative;
                }
                
                .brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                
                .brand-icon {
                    width: 48px;
                    height: 48px;
                    background: #111827;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .brand-text {
                    font-size: 28px;
                    font-weight: 300;
                    color: #111827;
                    letter-spacing: -0.02em;
                }
                
                .brand-text strong {
                    font-weight: 800;
                    font-style: italic;
                    background: linear-gradient(135deg, #111827, #374151);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                .badge {
                    display: inline-block;
                    padding: 6px 12px;
                    background: #f3f4f6;
                    border-radius: 100px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #4b5563;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-bottom: 16px;
                }
                
                /* Content section */
                .content {
                    padding: 0 40px 30px 40px;
                }
                
                .greeting {
                    font-size: 32px;
                    font-weight: 300;
                    color: #111827;
                    margin-bottom: 8px;
                    line-height: 1.2;
                }
                
                .greeting strong {
                    font-weight: 800;
                    font-style: italic;
                    color: #111827;
                }
                
                .subhead {
                    font-size: 16px;
                    color: #6b7280;
                    margin-bottom: 32px;
                    line-height: 1.6;
                }
                
                /* Stats section */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    margin-bottom: 40px;
                }
                
                .stat-card {
                    background: #f9fafb;
                    border-radius: 16px;
                    padding: 16px;
                    text-align: center;
                    border: 1px solid #f3f4f6;
                }
                
                .stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 4px;
                }
                
                .stat-label {
                    font-size: 12px;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                /* Job cards - Nike style */
                .jobs-section {
                    margin: 32px 0;
                }
                
                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                
                .title-line {
                    width: 40px;
                    height: 2px;
                    background: linear-gradient(90deg, #2563eb, #10b981);
                }
                
                .title-text {
                    font-size: 14px;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                
                .job-card {
                    background: #ffffff;
                    border: 1px solid #f3f4f6;
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 16px;
                    transition: all 0.2s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .job-card:hover {
                    border-color: #e5e7eb;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
                }
                
                .job-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 12px;
                }
                
                .job-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                }
                
                .match-score {
                    background: linear-gradient(135deg, #2563eb, #10b981);
                    color: white;
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 14px;
                    font-weight: 600;
                }
                
                .job-company {
                    font-size: 14px;
                    color: #6b7280;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .dot {
                    width: 4px;
                    height: 4px;
                    background: #d1d5db;
                    border-radius: 50%;
                }
                
                .job-description {
                    font-size: 14px;
                    color: #4b5563;
                    line-height: 1.6;
                    margin-bottom: 16px;
                }
                
                .skills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 12px;
                }
                
                .skill-tag {
                    background: #f3f4f6;
                    color: #374151;
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                /* CTA Button - Nike style */
                .cta-container {
                    text-align: center;
                    margin: 40px 0 20px 0;
                }
                
                .cta-button {
                    display: inline-block;
                    background: #111827;
                    color: white;
                    padding: 16px 40px;
                    border-radius: 12px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    border: none;
                }
                
                .cta-button:hover {
                    background: #1f2937;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
                }
                
                .cta-button span {
                    position: relative;
                    z-index: 1;
                }
                
                /* Footer */
                .footer {
                    background: #f9fafb;
                    padding: 32px 40px;
                    border-top: 1px solid #f3f4f6;
                }
                
                .social-links {
                    display: flex;
                    justify-content: center;
                    gap: 24px;
                    margin-bottom: 24px;
                }
                
                .social-link {
                    color: #9ca3af;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 500;
                    transition: color 0.2s;
                }
                
                .social-link:hover {
                    color: #111827;
                }
                
                .footer-text {
                    text-align: center;
                    font-size: 12px;
                    color: #9ca3af;
                    line-height: 1.6;
                }
                
                .divider {
                    width: 40px;
                    height: 1px;
                    background: #e5e7eb;
                    margin: 24px auto;
                }
                
                /* Responsive */
                @media (max-width: 600px) {
                    .email-wrapper {
                        margin: 20px;
                        border-radius: 20px;
                    }
                    
                    .header, .content, .footer {
                        padding-left: 24px;
                        padding-right: 24px;
                    }
                    
                    .greeting {
                        font-size: 28px;
                    }
                    
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .job-header {
                        flex-direction: column;
                        gap: 12px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <!-- Nike-inspired top gradient -->
                <div class="header-gradient"></div>
                
                <!-- Header -->
                <div class="header">
                    <div class="brand">
                        <div class="brand-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="brand-text">
                            AI <strong>MATCHER</strong>
                        </div>
                    </div>
                    <div class="badge">PREMIUM TALENT MATCHING</div>
                </div>
                
                <!-- Content -->
                <div class="content">
                    <h1 class="greeting">
                        Hello, <strong>[[${candidateName}]]</strong>
                    </h1>
                    <p class="subhead">
                        Based on your profile and preferences, our AI has found 
                        <strong style="color:#111827">[[${jobs.size()}]] perfect matches</strong> for you.
                    </p>
                    
                    <!-- Stats -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">[[${jobs.size()}]]</div>
                            <div class="stat-label">MATCHES</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">92%</div>
                            <div class="stat-label">ACCURACY</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">24h</div>
                            <div class="stat-label">RESPONSE</div>
                        </div>
                    </div>
                    
                    <!-- Jobs Section -->
                    <div class="jobs-section">
                        <div class="section-title">
                            <div class="title-line"></div>
                            <span class="title-text">RECOMMENDED POSITIONS</span>
                        </div>
                        
                        [[${jobs}]]
                    </div>
                    
                    <!-- CTA Button -->
                    <div class="cta-container">
                        <a href="http://localhost:5173/jobs" class="cta-button">
                            <span>VIEW ALL MATCHES →</span>
                        </a>
                    </div>
                    
                    <!-- Note -->
                    <p style="font-size:13px; color:#9ca3af; text-align:center; margin-top:24px;">
                        These matches are updated daily as new positions are posted
                    </p>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <div class="social-links">
                        <a href="#" class="social-link">TWITTER</a>
                        <a href="#" class="social-link">LINKEDIN</a>
                        <a href="#" class="social-link">GITHUB</a>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="footer-text">
                        <p>© [[${currentYear}]] AI Matcher. All rights reserved.</p>
                        <p style="margin-top:12px;">
                            123 Innovation Drive, San Francisco, CA 94105<br>
                            <a href="#" style="color:#6b7280; text-decoration:none;">Unsubscribe</a> • 
                            <a href="#" style="color:#6b7280; text-decoration:none;">Privacy</a> • 
                            <a href="#" style="color:#6b7280; text-decoration:none;">Terms</a>
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """;
    }

    /**
     * Send bulk email notifications
     */
    public void sendBulkNotification(List<String> recipients, String subject, String message) {
        recipients.forEach(email -> {
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                
                helper.setTo(email);
                helper.setSubject("📢 " + subject);
                helper.setText(generateNotificationTemplate(message), true);
                
                mailSender.send(mimeMessage);
                log.info("Sent bulk notification to: {}", email);
            } catch (Exception e) {
                log.error("Failed to send bulk notification to {}: {}", email, e.getMessage());
            }
        });
    }

    /**
     * Generate notification template
     */
    private String generateNotificationTemplate(String message) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Inter', Arial, sans-serif;
                    background: #f6f8fc;
                    margin: 0;
                    padding: 40px 20px;
                }
                .container {
                    max-width: 500px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1);
                }
                .header {
                    background: linear-gradient(135deg, #2563eb, #10b981);
                    padding: 30px;
                    text-align: center;
                }
                .header h2 {
                    color: white;
                    margin: 0;
                    font-weight: 300;
                    font-size: 24px;
                }
                .header h2 strong {
                    font-weight: 800;
                    font-style: italic;
                }
                .content {
                    padding: 30px;
                }
                .message {
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 20px 0;
                    border-left: 4px solid #2563eb;
                    color: #374151;
                    line-height: 1.6;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>AI <strong>MATCHER</strong></h2>
                </div>
                <div class="content">
                    <div class="message">
                        %s
                    </div>
                </div>
            </div>
        </body>
        </html>
        """.formatted(message);
    }

    /**
     * Send interview invitation
     */
    public void sendInterviewInvitation(String toEmail, String candidateName, 
                                       String jobTitle, String interviewDate, 
                                       String interviewLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🎯 AI Matcher – Interview Invitation");

            String html =
                    "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "    <style>" +
                    "        body { font-family: 'Inter', Arial, sans-serif; background: #f6f8fc; padding: 40px 20px; }" +
                    "        .container { max-width: 550px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); }" +
                    "        .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center; color: white; }" +
                    "        .content { padding: 40px; }" +
                    "        .date-box { background: #f9fafb; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0; border: 1px solid #f3f4f6; }" +
                    "        .date { font-size: 20px; font-weight: 700; color: #111827; }" +
                    "        .button { display: inline-block; background: #111827; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 24px; }" +
                    "    </style>" +
                    "</head>" +
                    "<body>" +
                    "    <div class=\"container\">" +
                    "        <div class=\"header\">" +
                    "            <h2 style=\"font-weight:300; font-size:28px;\">Interview <strong style=\"font-weight:800; font-style:italic;\">INVITATION</strong></h2>" +
                    "        </div>" +
                    "        <div class=\"content\">" +
                    "            <h3 style=\"font-size:24px; font-weight:300;\">Hello, " + candidateName + "</h3>" +
                    "            <p style=\"color:#4b5563; line-height:1.6;\">Congratulations! You've been selected for an interview for the position of <strong>" + jobTitle + "</strong>.</p>" +
                    "            <div class=\"date-box\">" +
                    "                <p style=\"color:#6b7280; margin-bottom:12px;\">SCHEDULED FOR</p>" +
                    "                <div class=\"date\">" + interviewDate + "</div>" +
                    "            </div>" +
                    "            <div style=\"text-align:center;\">" +
                    "                <a href=\"" + interviewLink + "\" class=\"button\">JOIN INTERVIEW →</a>" +
                    "            </div>" +
                    "        </div>" +
                    "    </div>" +
                    "</body>" +
                    "</html>";

            helper.setText(html, true);
            mailSender.send(message);
            log.info("Sent interview invitation to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send interview invitation: {}", e.getMessage());
            throw new RuntimeException("Interview invitation failed", e);
        }
    }
}