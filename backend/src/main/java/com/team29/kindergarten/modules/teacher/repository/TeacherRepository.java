package com.team29.kindergarten.modules.teacher.repository;

import com.team29.kindergarten.modules.teacher.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    List<Teacher> findAllByDeletedAtIsNull();
}