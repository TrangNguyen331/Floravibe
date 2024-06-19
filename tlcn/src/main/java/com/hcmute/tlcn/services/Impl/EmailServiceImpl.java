package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.order.OrderDto;
import com.hcmute.tlcn.dtos.order.ResponseOrderDto;
import com.hcmute.tlcn.entities.Account;
import com.hcmute.tlcn.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${email.reset-url}")
    private String resetLink;

    @Value("${email.guest-order-url}")
    private String guestOrderUrl;

    @Override
    public void sendMail(Account account) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        try {
            helper.setTo(account.getEmail());
            helper.setSubject("Floravibe - Reset Password");

            // Load the HTML email template
            Context context = new Context();
            context.setVariable("name", account.getFullName());
            context.setVariable("resetlink", resetLink+account.getUsername()); // Pass the link as a variable
            String htmlContent = templateEngine.process("email-template", context);

            // Set the HTML content of the email
            helper.setText(htmlContent, true);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        emailSender.send(message);
    }

    public void sendGuestOrderMail(String guestEmail, ResponseOrderDto orderDto) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        try {
            helper.setTo(guestEmail);
            helper.setSubject("Floravibe - Order Info");

            // Load the HTML email template
            Context context = new Context();
            context.setVariable("orderInfo", orderDto);

            String htmlContent = templateEngine.process("order-email-template", context);

            // Set the HTML content of the email
            helper.setText(htmlContent, true);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        emailSender.send(message);
    }
}
