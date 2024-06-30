package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.voucher.VoucherDto;
import com.hcmute.tlcn.entities.Voucher;
import com.hcmute.tlcn.exceptions.NotFoundException;
import com.hcmute.tlcn.repositories.VoucherRepository;
import com.hcmute.tlcn.services.VoucherService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoucherServiceImpl implements VoucherService {
    private final VoucherRepository repository;
    ModelMapper modelMapper = new ModelMapper();

    public VoucherServiceImpl(VoucherRepository repository){this.repository = repository;}

    @Override
    public Page<Voucher> getPaging(String search, Pageable pageable) {
        return repository.getPaging(search,pageable);
    }

    @Override
    public Voucher addNew(VoucherDto dto){
        Voucher voucher = new Voucher();
        modelMapper.map(dto,voucher);
        if(dto.isGuest()){
            voucher.setGuest(true);
        }
        if(dto.isOnlinePayment()){
            voucher.setOnlinePayment(true);
        }
        repository.save(voucher);
        return voucher;
    }

    @Override
    public Voucher update(String id, VoucherDto dto) {
        Voucher voucher = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Voucher not found!"));
        voucher.setVoucherName(dto.getVoucherName());
        voucher.setVoucherValue((dto.getVoucherValue()));
        voucher.setDescription(dto.getDescription());
        voucher.setEffectiveDate(dto.getEffectiveDate());
        voucher.setValidUntil(dto.getValidUntil());
        voucher.setQuantity(dto.getQuantity());
        voucher.setUsedVoucher(dto.getUsedVoucher());
        voucher.setGuest(dto.isGuest());
        voucher.setOnlinePayment(dto.isOnlinePayment());
        repository.save(voucher);
        return voucher;
    }
    @Override
    public Voucher delete(String id){
        Voucher voucher= repository.findById(id)
                .orElseThrow(()-> new NotFoundException("Voucher not found!"));
        voucher.setActive(!voucher.isActive);
        repository.save(voucher);
        return voucher;
    }
    @Override
    public Voucher updateGuest(String id){
        Voucher voucher= repository.findById(id)
                .orElseThrow(()-> new NotFoundException("Voucher not found!"));
        voucher.setGuest(!voucher.guest);
        repository.save(voucher);
        return voucher;
    }
    @Override
    public Voucher updateOnlineVoucher(String id){
        Voucher voucher= repository.findById(id)
                .orElseThrow(()-> new NotFoundException("Voucher not found!"));
        voucher.setOnlinePayment(!voucher.isOnlinePayment);
        repository.save(voucher);
        return voucher;
    }
    @Override
    public List<Voucher> getAllVouchers() {
        return repository.findAll();
    }
}
