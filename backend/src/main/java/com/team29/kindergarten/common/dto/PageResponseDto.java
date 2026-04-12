package com.team29.kindergarten.common.dto;

import lombok.Builder;

import org.springframework.data.domain.Page;

import java.util.List;

@Builder
public record PageResponseDto<T>(
        List<T> content,
        int totalPages,
        long totalElements,
        int size,
        int number,
        boolean first,
        boolean last,
        boolean empty
) {
    public static <T> PageResponseDto<T> from(Page<T> page) {
        return PageResponseDto.<T>builder()
                .content(page.getContent())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .size(page.getSize())
                .number(page.getNumber())
                .first(page.isFirst())
                .last(page.isLast())
                .empty(page.isEmpty())
                .build();
    }
}
