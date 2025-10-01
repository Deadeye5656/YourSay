package com.yoursay.backend.service;

import com.resend.Resend;
import com.resend.services.emails.model.SendEmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;


@Component
public class EmailSenderService {

    @Value("${resend.from.email}")
    private String fromEmail;

    @Value("${resend.api.key}")
    private String apiKey;

    public void emailVerificationCode(String email, Integer code) {
        try {
            String htmlBody = loadTemplateAndReplaceCode("templates/verification_email_template.html", code);
            Resend resend = new Resend(apiKey);
            SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                    .from(fromEmail)
                    .to(email)
                    .subject("YourSay Email Verification Code")
                    .html(htmlBody)
                    .build();
            resend.emails().send(sendEmailRequest);
        } catch (MailException | IOException e) {
            e.printStackTrace(); // Log the error for debugging
        }
    }

    private String loadTemplateAndReplaceCode(String templatePath, Integer code) throws IOException {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(templatePath)) {
            if (is == null) throw new IOException("Template not found: " + templatePath);
            String template = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            String paddedCode = String.format("%06d", code);
            return template.replace("{{CODE}}", paddedCode);
        }
    }
}
