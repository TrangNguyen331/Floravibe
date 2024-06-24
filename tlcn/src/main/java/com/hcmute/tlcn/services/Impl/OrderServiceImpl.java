package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.order.CancelOrderDetailDto;
import com.hcmute.tlcn.dtos.order.OrderDetailDto;
import com.hcmute.tlcn.dtos.order.OrderDto;
import com.hcmute.tlcn.dtos.order.ResponseOrderDto;
import com.hcmute.tlcn.dtos.voucher.VoucherDto;
import com.hcmute.tlcn.entities.*;
import com.hcmute.tlcn.exceptions.NotFoundException;
import com.hcmute.tlcn.repositories.AccountRepository;
import com.hcmute.tlcn.repositories.OrderRepository;
import com.hcmute.tlcn.repositories.PaymentRepos;
import com.hcmute.tlcn.repositories.ProductRepository;
import com.hcmute.tlcn.services.EmailService;
import com.hcmute.tlcn.services.OrderService;
import jakarta.mail.MessagingException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.hcmute.tlcn.utils.PageUtils.convertListToPage;

@Service
public class OrderServiceImpl implements OrderService {
    private final AccountRepository accountRepository;
    private final OrderRepository repository;
    private final ProductRepository productRepository;
    private final PaymentRepos paymentRepository;
    private final EmailService emailService;
    ModelMapper modelMapper = new ModelMapper();

    public OrderServiceImpl(AccountRepository accountRepository, OrderRepository repository, ProductRepository productRepository,PaymentRepos paymentRepository,EmailService emailService) {
        this.accountRepository = accountRepository;
        this.repository = repository;
        this.productRepository = productRepository;
        this.paymentRepository = paymentRepository;
        this.emailService = emailService;
    }

    @Override
    public List<ResponseOrderDto> getOrderByUser(String user) {
        List<ResponseOrderDto> response= new ArrayList<>();
        Account account = accountRepository.findByUsername(user)
                .orElseThrow(()-> new NotFoundException("Account not found"));
        List<Order> orders= repository.findAllByUser(account.getEmail());
        for (Order order: orders
             ) {
            ResponseOrderDto orderDto = modelMapper.map(order, ResponseOrderDto.class);
            for (OrderDetailDto detailDto:
                    orderDto.getDetails() ) {
                detailDto.setProduct(productRepository.findById(detailDto.getProductId()).orElse(null));
            }
            response.add(orderDto);
        }
        return response;
    }

    @Override
    public Page<ResponseOrderDto> getPaging(String search, Pageable pageable) {
        List<Order> orders = repository.findAllByStatus(search);
        Page<Order> orderPage = convertListToPage(orders,pageable);
        return orderPage.map(this::convertToResponseOrderDto);
    }
    private ResponseOrderDto convertToResponseOrderDto(Order order) {
        ResponseOrderDto orderDto = modelMapper.map(order, ResponseOrderDto.class);
        for (OrderDetailDto detailDto:
                orderDto.getDetails() ) {
            detailDto.setProduct(productRepository.findById(detailDto.getProductId()).orElse(null));
        }

        return orderDto;
    }

    @Override
    public Order addNew(OrderDto dto) {
        Order order=new Order();
        modelMapper.map(dto,order);

//        if (accountOptional.isEmpty()) {
//            throw new NotFoundException("Account not found!");
//        }
//        else{
//            Account account = accountOptional.get();
//            List<Order> userOrders = repository.findAllByUser(account.getEmail());
//
//            if (userOrders.isEmpty()) {
//                // Apply the discount for the first order
//                order.setFirstDiscount(dto.getFirstDiscount());
//            }
//        }
        VoucherDto voucherDto = new VoucherDto();
        modelMapper.map(dto.getVoucherDetail(), voucherDto);
        order.setVoucherDetail(voucherDto);
//        order.setCancelDate(null);
        repository.save(order);

        double unitTotal = 0;// mc thêm

        ResponseOrderDto orderDto = modelMapper.map(order, ResponseOrderDto.class);
        for (OrderDetailDto detailDto : orderDto.getDetails()) {
            Product product = productRepository.findById(detailDto.getProductId())
                    .orElseThrow(() -> new NotFoundException("Product not found"));
            int remainingStock = product.getStockQty() - detailDto.getQuantity();

            double unitPrice = detailDto.getQuantity() * product.getPrice();// mc thêm
//            detailDto.setSubtotal(unitPrice);// mc thêm
            unitTotal += unitPrice; // mc thêm

            product.setStockQty(remainingStock);
            productRepository.save(product);

            detailDto.setProduct(productRepository.findById(detailDto.getProductId()).orElse(null));
        }
        order.setUnitTotal(unitTotal);
        repository.save(order);

        String email = dto.getAdditionalOrder().getEmail();

        // Check if this is the user's first order
        Optional<Account> accountOptional = accountRepository.findByEmail(email);
        if(accountOptional.isEmpty() || dto.isGuest()){
            order.setGuest(dto.isGuest());
        }
        try {
            emailService.sendGuestOrderMail(email, orderDto);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        return order;
    }

    @Override
    public Order updateOrder(String id, OrderDto dto) {
        Order order= repository.findById(id).orElseThrow(()-> new NotFoundException("Order not found!"));
        modelMapper.map(dto,order);
        if ("COMPLETED".equals(order.getStatus())) {
            Payments payment = paymentRepository.findByOrderId(id)
                    .orElseThrow(() -> new NotFoundException("Payment not found for order"));

            payment.setPaid(true);
            payment.setUpdatedDate(LocalDateTime.now());
            paymentRepository.save(payment);
            order.setCompletedDate(LocalDateTime.now());
        }
        else if("CANCEL".equals(order.getStatus())){
            CancelOrderDetailDto cancelOrderDetailDto = dto.getCancelDetail();
            if (cancelOrderDetailDto != null) {
                CancelOrderDetail cancelDetail = new CancelOrderDetail();
                cancelDetail.setCancelEmail(cancelOrderDetailDto.getCancelEmail());
                cancelDetail.setCancelReason(cancelOrderDetailDto.getCancelReason());
                cancelDetail.setCancelRole(cancelOrderDetailDto.getCancelRole());
                cancelDetail.setCancelDate(LocalDateTime.now());
                order.setCancelDetail(cancelDetail);
            }
            adjustProductStock(order);
        }

        repository.save(order);
        return order;
    }
    private void adjustProductStock(Order order) {
        for (OrderDetail detail : order.getDetails()) {
            int quantity = detail.getQuantity();

            // Find product in database
            Optional<Product> optionalProduct = productRepository.findById(detail.getProductId());
            optionalProduct.ifPresent(product -> {
                // Increase stockQty by quantity from canceled order
                product.setStockQty(product.getStockQty() + quantity);
                productRepository.save(product);
            });
        }
    }
    @Override
    public Order cancelOrder(String id, CancelOrderDetailDto cancelOrderDetailDto) {
        Order order= repository.findById(id).orElseThrow(()-> new NotFoundException("Order not found!"));
        order.setStatus("CANCEL");
        CancelOrderDetail cancelOrderDetail = new CancelOrderDetail();
        cancelOrderDetail.setCancelEmail(cancelOrderDetailDto.getCancelEmail());
        cancelOrderDetail.setCancelReason(cancelOrderDetailDto.getCancelReason());
        cancelOrderDetail.setCancelRole(cancelOrderDetailDto.getCancelRole());
        cancelOrderDetail.setCancelDate(LocalDateTime.now());

        order.setCancelDetail(cancelOrderDetail);
        repository.save(order);

        for (OrderDetail detail : order.getDetails()) {
            int quantity = detail.getQuantity();

            // Find product in database
            Optional<Product> optionalProduct = productRepository.findById(detail.getProductId());
            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();
                // Increase stockQty by quantity from canceled order
                product.setStockQty(product.getStockQty() + quantity);

                productRepository.save(product);
            }
        }
        return order;
    }

    @Override
    public ResponseOrderDto getById(String id) {
        Order order = repository.findById(id).orElseThrow(()->new NotFoundException("Order not found!"));
        ResponseOrderDto orderDto = modelMapper.map(order, ResponseOrderDto.class);
        for (OrderDetailDto detailDto:
                orderDto.getDetails() ) {
            detailDto.setProduct(productRepository.findById(detailDto.getProductId()).orElse(null));
        }
        return orderDto;
    }
    @Override
    public List<ResponseOrderDto> getAllOrders() {
        List<Order> orders = repository.findAll();
        return orders.stream()
                .map(this::convertToResponseOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResponseOrderDto> getOrderByEmail(String email) {
        List<ResponseOrderDto> response = new ArrayList<>();

        List<Order> orders = repository.findAllByUser(email);
        for (Order order : orders) {
            ResponseOrderDto orderDto = modelMapper.map(order, ResponseOrderDto.class);

            for (OrderDetailDto detailDto : orderDto.getDetails()) {
                Product product = productRepository.findById(detailDto.getProductId()).orElse(null);
                detailDto.setProduct(product);
            }

            response.add(orderDto);
        }
        return response;
    }

}
