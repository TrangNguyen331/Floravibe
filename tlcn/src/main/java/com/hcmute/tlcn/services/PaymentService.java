package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.payment.PaymentDTO;
import com.hcmute.tlcn.dtos.payment.UpdatePaymentStatusRequest;
import com.hcmute.tlcn.entities.Payments;
import org.springframework.stereotype.Service;

import java.util.List;

public interface PaymentService {
    String createPayment(PaymentDTO paymentDTO);

    void UpdatePaymentStatus(String orderId, UpdatePaymentStatusRequest dto);
    List<Payments> getAllPayments();
}
