package com.hcmute.tlcn.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Document
public class Product {
    @Id
    public String id;
    public String name;
    public String description;
    public String additionalInformation;
    public double price;
    public int stockQty;
    public List<Tag> tags=new ArrayList<>();
    public List<String> images=new ArrayList<>();
    public List<Review> reviews=new ArrayList<>();
    public List<Collection> collections=new ArrayList<>();
    public boolean isActive=true;
    @CreatedDate
    private LocalDateTime createdDate;
}
