package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.tag.TagDto;
import com.hcmute.tlcn.entities.Tag;
import com.hcmute.tlcn.exceptions.NotFoundException;
import com.hcmute.tlcn.repositories.TagRepository;
import com.hcmute.tlcn.services.TagService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class TagServiceImpl implements TagService {
    private final TagRepository repository;
    ModelMapper modelMapper = new ModelMapper();
    public TagServiceImpl(TagRepository repository) {
        this.repository = repository;
    }
    @Override
    public List<Tag> getAll() {
        return repository.findAll();
    }

    @Override
    public Tag addNew(TagDto dto) {
        Tag tag = new Tag();
        modelMapper.map(dto,tag);
        repository.save(tag);
        return tag;
    }

    @Override
    public Tag update(String id, TagDto dto) {
        Tag tag = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tag not found"));
        modelMapper.map(dto,tag);
        repository.save(tag);
        return tag;
    }

    @Override
    public Tag delete(String id) {
        Tag tag = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tag not found"));
        repository.delete(tag);
        return tag;
    }
}
