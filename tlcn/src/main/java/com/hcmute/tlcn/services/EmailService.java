package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.order.ResponseOrderDto;
import com.hcmute.tlcn.entities.Account;
import jakarta.mail.MessagingException;
public interface EmailService {
    void sendMail(Account account) throws MessagingException;
    void sendGuestOrderMail(String guestEmail, ResponseOrderDto orderDto) throws MessagingException;
}
