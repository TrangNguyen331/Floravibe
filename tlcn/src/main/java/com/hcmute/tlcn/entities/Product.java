package com.hcmute.tlcn.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    public List<String> tags=new ArrayList<>();
    public List<String> images=new ArrayList<>();
    public List<Review> reviews=new ArrayList<>();
    public List<String> collections=new ArrayList<>();
    public boolean isActive=true;
}
