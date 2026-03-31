package com.team29.kindergarten.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(
        info = @Info(
                title = "Kindergarten API",
                version = "v1",
                description = "Backend API for kindergarten management",
                contact = @Contact(name = "Team 29")
        )
)
public class OpenApiConfig {
}
