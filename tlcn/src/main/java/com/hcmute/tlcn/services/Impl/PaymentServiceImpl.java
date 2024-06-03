package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.config.VNPayConfig;
import com.hcmute.tlcn.dtos.payment.PaymentDTO;
import com.hcmute.tlcn.dtos.payment.UpdatePaymentStatusRequest;
import com.hcmute.tlcn.entities.Payments;
import com.hcmute.tlcn.entities.ThirdPartyPaymentDetail;
import com.hcmute.tlcn.entities.ThirdPaymentStatusEnum;
import com.hcmute.tlcn.exceptions.NotFoundException;
import com.hcmute.tlcn.repositories.PaymentRepos;
import com.hcmute.tlcn.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.bson.json.JsonObject;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    final PaymentRepos paymentRepository;
    final VNPayConfig vnpayComponent;

    @Override
    public String createPayment(PaymentDTO paymentDTO) {
        Payments entity = new Payments();
        entity.setOrderId(paymentDTO.getOrderId());
        entity.setTotalAmount(paymentDTO.getTotalAmount());
        String linkPayment = null;

        switch (paymentDTO.getPaymentMethod()) {
            case Payments.VNPAY -> {
                ThirdPartyPaymentDetail detail = new ThirdPartyPaymentDetail();
                detail.setNamePlatform(Payments.VNPAY);
                detail.setStatus(ThirdPaymentStatusEnum.PENDING);
                entity.setThirdPartyPaymentDetail(detail);
                linkPayment = createVNPayUrl(paymentDTO);

            }
            case Payments.MOMO -> {
                //TODO: Implement Momo payment
            }
            default -> {
                entity.setPaymentMethod(Payments.CASH);
            }
        }
        entity.setUpdatedDate(LocalDateTime.now());
        paymentRepository.save(entity);
        return linkPayment;
    }

    private String createVNPayUrl(PaymentDTO paymentDTO) {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnpayComponent.getVnpTmnCode());
        params.put("vnp_Amount", String.valueOf(paymentDTO.getTotalAmount().multiply(new BigDecimal(100)).toBigInteger()));
        params.put("vnp_CurrCode", "VND");

        params.put("vnp_TxnRef", paymentDTO.getOrderId());
        params.put("vnp_OrderInfo", "Thanh toán đơn hàng [OrderID]: " + paymentDTO.getOrderId());
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnpayComponent.getReturnUrl());
        params.put("vnp_IpAddr", "127.0.0.1");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        params.put("vnp_CreateDate", vnp_CreateDate);
        //expiry date after 15 minutes
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = vnpayComponent.hmacSHA512(vnpayComponent.getVnpHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return vnpayComponent.getVnpUrl() + "?" + queryUrl;
    }

    @Override
    public void UpdatePaymentStatus(String orderId, UpdatePaymentStatusRequest dto) {
        Payments entity = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new NoSuchElementException("Payment not found"));
        var detail = entity.getThirdPartyPaymentDetail();
        detail.setTransactionDetail(dto.getTransactionDetail());
        detail.setStatus(ThirdPaymentStatusEnum.fromString(dto.getStatus()));
        detail.setPayDate(dto.getPayDate());
        detail.setUpdatedDate(LocalDateTime.now());

        entity.setUpdatedDate(LocalDateTime.now());
        entity.setPaid(true);
        entity.setThirdPartyPaymentDetail(detail);
        paymentRepository.save(entity);
    }
    @Override
    public List<Payments> getAllPayments() {
        return paymentRepository.findAll();
    }
}
