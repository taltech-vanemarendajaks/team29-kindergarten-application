package com.team29.kindergarten.modules.announcement.mapper;


import com.team29.kindergarten.modules.announcement.dto.AnnouncementResponseDto;
import com.team29.kindergarten.modules.announcement.dto.AnnouncementUserResponseDto;
import com.team29.kindergarten.modules.announcement.model.Announcement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface AnnouncementMapper {

    @Mapping(target = "createdByName", source = "createdByName")
    AnnouncementResponseDto toPostResponseDto(
        Announcement announcement,
        String createdByName
    );


    @Mapping(target = "createdByName", source = "announcement.creator.fullName")
    @Mapping(target = "read", source = "isRead")
    AnnouncementUserResponseDto toUserResponseDto(
        Announcement announcement,
        boolean isRead
    );


    @Mapping(target = "createdByName", source = "announcement.creator.fullName")
    AnnouncementResponseDto toResponseDto(
        Announcement announcement
    );
}


