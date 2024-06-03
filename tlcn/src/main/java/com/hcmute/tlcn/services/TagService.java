package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.tag.TagDto;
import com.hcmute.tlcn.entities.Tag;

import java.util.List;

public interface TagService {
    List<Tag> getAll();

    Tag addNew(TagDto dto);

    Tag update(String id, TagDto dto);

    Tag delete(String id);
}
