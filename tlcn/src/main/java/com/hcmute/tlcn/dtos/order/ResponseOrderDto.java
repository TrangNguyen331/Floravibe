package com.hcmute.tlcn.dtos.order;

import com.hcmute.tlcn.entities.OrderDetail;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ResponseOrderDto {
    @Id
    private String id;
    private List<OrderDetailDto> details;
    private AdditionalOrderDetailDto additionalOrder;
    private double total;
    private String status;
    private String methodPaid;
    private boolean isPaid =false;

    @CreatedDate
    private LocalDateTime createdDate;
}
