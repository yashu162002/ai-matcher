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
     * Send recommended jobs email
     */
    public void sendRecommendedJobsEmail(
            String toEmail,
            String candidateName,
            List<Map<String, Object>> jobs
    ) {

        try {

            if (jobs == null) {
                jobs = List.of();
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setFrom("noreply@aimatcher.com", "AI Matcher");
            helper.setSubject("AI Matcher – Your Personalized Job Matches");

            Context context = new Context();
            context.setVariable("candidateName", candidateName == null ? "there" : candidateName);
            context.setVariable("jobs", jobs);
            context.setVariable("currentYear", java.time.Year.now().getValue());

            String htmlContent = generateNikeStyleEmail(context);

            helper.setText(htmlContent, true);

            mailSender.send(message);

            log.info("Job recommendation email sent to {}", toEmail);

        } catch (Exception e) {

            log.error("Email sending failed {}", e.getMessage());
            throw new RuntimeException("Email sending failed", e);

        }
    }

    /**
     * Generate email template
     */
    private String generateNikeStyleEmail(Context context) {

        return """
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>AI Matcher</title>
<style>

body{
font-family:Arial;
background:#f6f8fc;
padding:40px;
}

.container{
max-width:600px;
margin:auto;
background:white;
border-radius:20px;
overflow:hidden;
box-shadow:0 20px 40px rgba(0,0,0,0.1);
}

.header{
background:linear-gradient(135deg,#2563eb,#10b981);
color:white;
padding:30px;
text-align:center;
}

.content{
padding:30px;
}

.job{
border:1px solid #eee;
padding:15px;
border-radius:10px;
margin-bottom:15px;
}

.score{
background:#2563eb;
color:white;
padding:5px 10px;
border-radius:10px;
font-size:12px;
}

.footer{
padding:20px;
background:#fafafa;
text-align:center;
font-size:12px;
color:#777;
}

</style>
</head>

<body>

<div class="container">

<div class="header">
<h2>AI MATCHER</h2>
</div>

<div class="content">

<h3>Hello [[${candidateName}]]</h3>

<p>Our AI found <strong>[[${jobs.size()}]] job matches</strong> for you.</p>

<div>

[[${jobs}]]

</div>

<p style="margin-top:20px">
<a href="http://localhost:5173/jobs">View All Matches</a>
</p>

</div>

<div class="footer">

© [[${currentYear}]] AI Matcher

</div>

</div>

</body>
</html>
""";
    }

    /**
     * Send bulk notifications
     */
    public void sendBulkNotification(
            List<String> recipients,
            String subject,
            String message
    ) {

        recipients.forEach(email -> {

            try {

                MimeMessage mimeMessage = mailSender.createMimeMessage();

                MimeMessageHelper helper =
                        new MimeMessageHelper(mimeMessage, true, "UTF-8");

                helper.setTo(email);
                helper.setSubject(subject);
                helper.setText(generateNotificationTemplate(message), true);

                mailSender.send(mimeMessage);

            } catch (Exception e) {

                log.error("Failed sending bulk email {}", e.getMessage());

            }

        });

    }

    /**
     * Notification template
     */
    private String generateNotificationTemplate(String message) {

        return """
<html>
<body style="font-family:Arial;background:#f6f8fc;padding:40px">

<div style="max-width:500px;margin:auto;background:white;padding:30px;border-radius:15px">

<h2>AI Matcher</h2>

<p>%s</p>

</div>

</body>
</html>
""".formatted(message);

    }

    /**
     * Interview invitation email
     */
    public void sendInterviewInvitation(
            String toEmail,
            String candidateName,
            String jobTitle,
            String interviewDate,
            String interviewLink
    ) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Interview Invitation - AI Matcher");

            String html = """
<html>
<body style="font-family:Arial;background:#f6f8fc;padding:40px">

<div style="max-width:500px;margin:auto;background:white;padding:30px;border-radius:20px">

<h2>Interview Invitation</h2>

<p>Hello %s</p>

<p>You have been shortlisted for <b>%s</b></p>

<p>Interview Date: %s</p>

<p>
<a href="%s">Join Interview</a>
</p>

</div>

</body>
</html>
""".formatted(candidateName, jobTitle, interviewDate, interviewLink);

            helper.setText(html, true);

            mailSender.send(message);

        } catch (Exception e) {

            throw new RuntimeException("Interview email failed");

        }

    }

}