package com.hcmute.tlcn.dtos.product;

import com.hcmute.tlcn.dtos.review.ReviewDto;
import com.hcmute.tlcn.entities.Review;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    public String name;
    public String description;
    public String additionalInformation;
    public double price;
    public List<String> tags;
    public List<String> images;
    public List<String> collections;
}
