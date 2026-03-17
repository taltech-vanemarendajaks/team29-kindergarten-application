package com.team29.kindergarten.modules.teacher.controller;

import com.team29.kindergarten.generated.api.TeachersApi;
import com.team29.kindergarten.generated.model.CreateTeacherRequest;
import com.team29.kindergarten.generated.model.TeacherResponse;
import com.team29.kindergarten.generated.model.UpdateTeacherRequest;
import com.team29.kindergarten.modules.teacher.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TeacherController implements TeachersApi {

    private final TeacherService service;

    @Override
    public ResponseEntity<List<TeacherResponse>> listTeachers() {
        return ResponseEntity.ok(service.list());
    }

    // other methods will show compile errors until you implement them
    // stub them out for now:

    @Override
    public ResponseEntity<TeacherResponse> createTeacher(CreateTeacherRequest body) {
        throw new UnsupportedOperationException("not yet implemented");
    }

    @Override
    public ResponseEntity<TeacherResponse> getTeacher(Long id) {
        throw new UnsupportedOperationException("not yet implemented");
    }

    @Override
    public ResponseEntity<TeacherResponse> updateTeacher(Long id, UpdateTeacherRequest body) {
        throw new UnsupportedOperationException("not yet implemented");
    }

    @Override
    public ResponseEntity<Void> deleteTeacher(Long id) {
        throw new UnsupportedOperationException("not yet implemented");
    }
}