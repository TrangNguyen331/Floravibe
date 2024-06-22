package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.product.ResponseProductStatsDto;
import com.hcmute.tlcn.entities.Order;
import com.hcmute.tlcn.entities.OrderDetail;
import com.hcmute.tlcn.entities.Product;
import com.hcmute.tlcn.entities.Review;
import com.hcmute.tlcn.repositories.OrderRepository;
import com.hcmute.tlcn.services.ProductService;
import com.hcmute.tlcn.services.ProductStatsService;
import com.hcmute.tlcn.utils.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ProductStatsServieImpl implements ProductStatsService {
    private final OrderRepository orderRepository;
    private final ProductService productService;
    @Override
    public Page<ResponseProductStatsDto> getProductStats(String search, Pageable pageable) {
        List<Order> completedOrders = orderRepository.findAllByStatus("COMPLETED");
        List<ResponseProductStatsDto> statsList = new ArrayList<>();

        // Iterate through completed orders and aggregate statistics
        for (Order order : completedOrders) {
            for (OrderDetail detail : order.getDetails()) {
                String productId = detail.getProductId();
                int quantitySold = detail.getQuantity();

                // Check if product stats already exist in the list
                boolean found = false;
                for (ResponseProductStatsDto statsDto : statsList) {
                    if (statsDto.getProductId().equals(productId)) {
                        statsDto.setOrderCount(statsDto.getOrderCount() + 1);
                        statsDto.setTotalQuantitySold(statsDto.getTotalQuantitySold() + quantitySold);
                        found = true;
                        break;
                    }
                }

                // If product stats not found, create new stats DTO and add to the list
                if (!found) {
                    Product product = productService.getProductById(productId);
                    if (search.isEmpty() || product.getName().toLowerCase().contains(search.toLowerCase())) {
                        String productImage = product.getImages().isEmpty() ? null : product.getImages().get(0);

                        // Tính toán số sao trung bình và số lượng review
                        int totalRating = product.getReviews().stream().mapToInt(Review::getRatingValue).sum();
                        int reviewCount = product.getReviews().size();
                        double averageRating = reviewCount > 0 ? (double) totalRating / reviewCount : 0;

                        ResponseProductStatsDto statsDto = new ResponseProductStatsDto();
                        statsDto.setProductId(productId);
                        statsDto.setProductName(product.getName());
                        statsDto.setProductImage(productImage);
                        statsDto.setOrderCount(1);
                        statsDto.setTotalQuantitySold(quantitySold);
                        statsDto.setAverageRating(averageRating); // Đặt giá trị này
                        statsDto.setReviewCount(reviewCount); // Đặt giá trị này

                        statsList.add(statsDto);
                    }
                }
            }
        }

        return PageUtils.convertListToPage(statsList, pageable);
    }
}
