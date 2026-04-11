package com.team29.kindergarten.modules.group.mapper;

import com.team29.kindergarten.modules.group.dto.GroupRequestDto;
import com.team29.kindergarten.modules.group.dto.GroupResponseDto;
import com.team29.kindergarten.modules.group.dto.GroupTeacherSummaryDto;
import com.team29.kindergarten.modules.group.model.Group;
import com.team29.kindergarten.modules.teacher.model.Teacher;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface GroupMapper {

    @Mapping(target = "teacher", source = "teacher")
    GroupResponseDto toResponseDto(Group group);

    GroupTeacherSummaryDto toTeacherSummaryDto(Teacher teacher);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Group toEntity(GroupRequestDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromDto(GroupRequestDto dto, @MappingTarget Group group);
}
