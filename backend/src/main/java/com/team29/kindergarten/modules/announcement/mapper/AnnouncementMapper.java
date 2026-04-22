package com.team29.kindergarten.modules.announcement.mapper;

import com.team29.kindergarten.modules.announcement.dto.AnnouncementRequestDto;
import com.team29.kindergarten.modules.announcement.dto.AnnouncementResponseDto;
import com.team29.kindergarten.modules.announcement.model.Announcement;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface AnnouncementMapper {

   AnnouncementResponseDto toResponseDto(Announcement announcement);

    @Mapping(target = "id",        ignore = true)
    @Mapping(target = "tenantId",  ignore = true)    
    @Mapping(target = "title",  ignore = true)
    @Mapping(target = "content", ignore = true)    
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "expiresAt", ignore = true)      
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Announcement toEntity(AnnouncementRequestDto request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id",        ignore = true)
    @Mapping(target = "tenantId",  ignore = true)    
    @Mapping(target = "title",  ignore = true)
    @Mapping(target = "content", ignore = true)    
    @Mapping(target = "createdBy",  ignore = true) 
    @Mapping(target = "expiresAt", ignore = true)       
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromDto(AnnouncementRequestDto dto, @MappingTarget Announcement announcement);
}
