package com.hcmute.tlcn.services;

import com.hcmute.tlcn.entities.Account;
import jakarta.mail.MessagingException;
public interface EmailService {
    void sendMail(Account account) throws MessagingException;
}
