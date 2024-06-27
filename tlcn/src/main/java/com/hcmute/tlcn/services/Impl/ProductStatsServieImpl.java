package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.statistic.ResponseProductStatsDto;
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
        List<Product> allProducts = productService.getAllProducts();
        List<ResponseProductStatsDto> statsList = new ArrayList<>();

        for (Product product : allProducts) {
            if (product.isActive()) { // Chỉ xử lý các sản phẩm có isActive là true

                String productImage = product.getImages().isEmpty() ? null : product.getImages().get(0);

                // Tính toán số sao trung bình và số lượng review
                int totalRating = product.getReviews().stream().mapToInt(Review::getRatingValue).sum();
                int reviewCount = product.getReviews().size();
                double averageRating = reviewCount > 0 ? (double) totalRating / reviewCount : 0;

                // Tìm tất cả các chi tiết đơn hàng cho sản phẩm này trong các đơn hàng hoàn thành
                int orderCount = 0;
                int totalQuantitySold = 0;
                for (Order order : completedOrders) {
                    for (OrderDetail detail : order.getDetails()) {
                        if (detail.getProductId().equals(product.getId())) {
                            orderCount++;
                            totalQuantitySold += detail.getQuantity();
                        }
                    }
                }

                if (search.isEmpty() || product.getName().toLowerCase().contains(search.toLowerCase())) {
                    ResponseProductStatsDto statsDto = new ResponseProductStatsDto();
                    statsDto.setProductId(product.getId());
                    statsDto.setProductName(product.getName());
                    statsDto.setProductImage(productImage);
                    statsDto.setOrderCount(orderCount);
                    statsDto.setTotalQuantitySold(totalQuantitySold);
                    statsDto.setAverageRating(averageRating);
                    statsDto.setReviewCount(reviewCount);

                    statsList.add(statsDto);
                }
            }
        }

        return PageUtils.convertListToPage(statsList, pageable);
    }
}
