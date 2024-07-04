package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.statistic.ResponseBestProductDto;
import com.hcmute.tlcn.dtos.statistic.ResponseProductStatsDto;
import com.hcmute.tlcn.dtos.statistic.TopSellingProductDto;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProductStatsServiceImpl implements ProductStatsService {
    private final OrderRepository orderRepository;
    private final ProductService productService;
    @Override
    public Page<ResponseProductStatsDto> getProductStats(String search, Pageable pageable) {
        List<Order> completedOrders = orderRepository.findAllByStatus("COMPLETED");
        List<Product> allProducts = productService.getAllProducts();
        List<ResponseProductStatsDto> statsList = new ArrayList<>();

        for (Product product : allProducts) {
            if (product.isActive()) { // Chỉ xử lý các sản phẩm có isActive là true

                List<String> productImages = product.getImages().isEmpty() ? null : product.getImages();

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
                    statsDto.setProductImages(productImages);
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

        return PageUtils.convertListToPage(statsList, pageable);
    }
    @Override
    public List<ResponseBestProductDto> getBestProducts() {
        List<Order> completedOrders = orderRepository.findAllByStatus("COMPLETED");
        List<Product> allProducts = productService.getAllProducts();
        List<ResponseBestProductDto> bestProductList = new ArrayList<>();

        for (Product product : allProducts) {
            if (product.isActive()) {

                // Tìm tất cả các chi tiết đơn hàng cho sản phẩm này trong các đơn hàng hoàn thành

                int totalQuantitySold = 0;
                for (Order order : completedOrders) {
                    for (OrderDetail detail : order.getDetails()) {
                        if (detail.getProductId().equals(product.getId())) {
                            totalQuantitySold += detail.getQuantity();
                        }
                    }
                }
                ResponseBestProductDto statsDto = new ResponseBestProductDto();
                statsDto.setProductId(product.getId());
                statsDto.setProduct(product);
                statsDto.setTotalQuantitySold(totalQuantitySold);

                bestProductList.add(statsDto);

            }
        }

        return bestProductList;
    }

    public List<TopSellingProductDto> getTopSellingProducts(int year) {
        List<TopSellingProductDto> top10Products = new ArrayList<>();

        // Lấy danh sách các đơn hàng đã hoàn thành trong năm cụ thể
        LocalDateTime startDate = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endDate = LocalDateTime.of(year, 12, 31, 23, 59);
        List<Order> completedOrders = orderRepository.findByStatusAndCompletedDateBetween("COMPLETED", startDate, endDate);

        // Tạo một danh sách để lưu tổng số lượng bán của từng sản phẩm theo tháng
        List<TopSellingProductDto> productSalesList = new ArrayList<>();

        // Lặp qua từng đơn hàng đã hoàn thành
        for (Order order : completedOrders) {
            // Lặp qua từng chi tiết đơn hàng
            for (OrderDetail detail : order.getDetails()) {
                // Lấy productId và quantity
                String productId = detail.getProductId();
                int quantity = detail.getQuantity();

                // Kiểm tra xem sản phẩm đã tồn tại trong danh sách chưa
                boolean found = false;
                for (TopSellingProductDto dto : productSalesList) {
                    if (dto.getProductId().equals(productId) && dto.getYear() == order.getCompletedDate().getYear() && dto.getMonth() == order.getCompletedDate().getMonthValue()) {
                        dto.setQuantitySold(dto.getQuantitySold() + quantity);
                        found = true;
                        break;
                    }
                }

                // Nếu sản phẩm chưa tồn tại trong danh sách, thêm mới
                if (!found) {
                    TopSellingProductDto newDto = new TopSellingProductDto();
                    newDto.setProductId(productId);
                    newDto.setQuantitySold(quantity);
                    newDto.setYear(order.getCompletedDate().getYear());
                    newDto.setMonth(order.getCompletedDate().getMonthValue());
                    productSalesList.add(newDto);
                }
            }
        }

        // Lấy tên sản phẩm và cập nhật vào DTO
        for (TopSellingProductDto dto : productSalesList) {
            Product product = productService.getProductById(dto.getProductId());
            if (product != null) {
                dto.setProductName(product.getName());
            }
        }

        // Sắp xếp danh sách theo số lượng bán giảm dần
        productSalesList.sort((p1, p2) -> p2.getQuantitySold() - p1.getQuantitySold());
        return productSalesList;

        // Lấy top 10 sản phẩm bán chạy nhất
//        top10Products = productSalesList.stream()
//                .limit(10)
//                .collect(Collectors.toList());
//
//        // Trả về danh sách top 10 sản phẩm bán chạy theo tháng trong năm cụ thể
//        return top10Products;
    }
}
