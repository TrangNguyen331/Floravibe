package com.hcmute.tlcn.dtos.product;

import com.hcmute.tlcn.dtos.review.ReviewDto;
import com.hcmute.tlcn.entities.Collection;
import com.hcmute.tlcn.entities.Review;
import com.hcmute.tlcn.entities.Tag;
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
    public int stockQty;
    public List<Tag> tags;
    public List<String> images;
    public List<Collection> collections;
}
