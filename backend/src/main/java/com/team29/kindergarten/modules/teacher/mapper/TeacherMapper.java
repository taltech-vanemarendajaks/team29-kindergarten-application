package com.team29.kindergarten.modules.teacher.mapper;

import com.team29.kindergarten.generated.model.TeacherResponse;
import com.team29.kindergarten.modules.teacher.model.Teacher;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TeacherMapper {
    TeacherResponse toResponse(Teacher teacher);
    List<TeacherResponse> toResponseList(List<Teacher> teachers);
}