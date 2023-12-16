package com.hcmute.tlcn.controllers;

import com.hcmute.tlcn.dtos.order.OrderDto;
import com.hcmute.tlcn.dtos.order.ResponseOrderDto;
import com.hcmute.tlcn.entities.Order;
import com.hcmute.tlcn.entities.Product;
import com.hcmute.tlcn.services.OrderService;
import com.hcmute.tlcn.utils.PageUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/${application.version}/orders")

public class OrderController {
    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<ResponseOrderDto>> getAllOrder(Principal principal){
        List<ResponseOrderDto> result = service.getOrderByUser(principal.getName());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/paging")
    public ResponseEntity<Page<ResponseOrderDto>> getOrderPaging(
            @RequestParam(name = "search", required = false, defaultValue = "") String search,
                                                                 @RequestParam(name = "page", required = false, defaultValue = "${application.default.paging.page}") int page,
                                                                 @RequestParam(name = "size", required = false, defaultValue = "${application.default.paging.size}") int size,
                                                                 @RequestParam(name = "sort", required = false, defaultValue = "DESC") String sort,
                                                                 @RequestParam(name = "column", required = false, defaultValue = "createdDate") String sortColumn){
        Pageable pageable = PageUtils.createPageable(page, size, sort, sortColumn);
        Page<ResponseOrderDto> result = service.getPaging(search,pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    //@PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseOrderDto> getOrderById(@PathVariable String id){
        ResponseOrderDto result = service.getById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Order> addNewOrder(@RequestBody OrderDto dto){
        Order result = service.addNew(dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable String id,@RequestBody OrderDto dto){
        Order result = service.updateOrder(id,dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
