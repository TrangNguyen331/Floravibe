package com.hcmute.tlcn.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class Review {
    public String id = UUID.randomUUID().toString();
    private String orderId;
    public String accountName;
    public Account account;
    public String content;
    public int ratingValue;
    public LocalDateTime createDate=LocalDateTime.now();
}
