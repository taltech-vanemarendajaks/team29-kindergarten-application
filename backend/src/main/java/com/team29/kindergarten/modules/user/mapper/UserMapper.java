package com.team29.kindergarten.modules.user.mapper;

import com.team29.kindergarten.modules.user.dto.UserResponseDto;
import com.team29.kindergarten.modules.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponseDto toUserResponseDto(User user);
}
