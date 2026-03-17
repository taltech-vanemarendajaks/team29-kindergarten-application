package com.team29.kindergarten.modules.teacher.service;

import com.team29.kindergarten.generated.model.TeacherResponse;
import com.team29.kindergarten.modules.teacher.mapper.TeacherMapper;
import com.team29.kindergarten.modules.teacher.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeacherService {

    private final TeacherRepository repository;
    private final TeacherMapper mapper;

    public List<TeacherResponse> list() {
        return mapper.toResponseList(repository.findAllByDeletedAtIsNull());
    }
}