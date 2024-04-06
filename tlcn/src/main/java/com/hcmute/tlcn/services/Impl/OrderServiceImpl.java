package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.order.OrderDetailDto;
import com.hcmute.tlcn.dtos.order.OrderDto;
import com.hcmute.tlcn.dtos.order.ResponseOrderDto;
import com.hcmute.tlcn.dtos.voucher.VoucherDto;
import com.hcmute.tlcn.entities.Account;
import com.hcmute.tlcn.entities.Order;
import com.hcmute.tlcn.exceptions.NotFoundException;
import com.hcmute.tlcn.repositories.AccountRepository;
import com.hcmute.tlcn.repositories.OrderRepository;
import com.hcmute.tlcn.repositories.ProductRepository;
import com.hcmute.tlcn.services.OrderService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.hcmute.tlcn.utils.PageUtils.convertListToPage;

@Service
public class OrderServiceImpl implements OrderService {
    private final AccountRepository accountRepository;
    private final OrderRepository repository;
    private final ProductRepository productRepository;
    ModelMapper modelMapper = new ModelMapper();

    public OrderServiceImpl(AccountRepository accountRepository, OrderRepository repository, ProductRepository productRepository) {
        this.accountRepository = accountRepository;
        this.repository = repository;
        this.productRepository = productRepository;
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

        VoucherDto voucherDto = new VoucherDto();
        voucherDto.setId(dto.getVoucherDetail().getId());
        voucherDto.setVoucherName(dto.getVoucherDetail().getVoucherName());
        voucherDto.setVoucherValue(dto.getVoucherDetail().getVoucherValue());
        voucherDto.setDescription(dto.getVoucherDetail().getDescription());
        voucherDto.setEffectiveDate(dto.getVoucherDetail().getEffectiveDate());
        voucherDto.setValidUntil(dto.getVoucherDetail().getValidUntil());
        voucherDto.setQuantity(dto.getVoucherDetail().getQuantity());
        voucherDto.setUsedVoucher(dto.getVoucherDetail().getUsedVoucher());
        order.setVoucherDetail(voucherDto);
        repository.save(order);
        return order;
    }

    @Override
    public Order updateOrder(String id, OrderDto dto) {
        Order order= repository.findById(id).orElseThrow(()-> new NotFoundException("Order not found!"));
        modelMapper.map(dto,order);
        repository.save(order);
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
//        orderDto.setVoucherDetail(order.getVoucherDetail());
        return orderDto;
    }
}
