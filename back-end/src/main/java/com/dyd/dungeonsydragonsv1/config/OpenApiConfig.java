package com.dyd.dungeonsydragonsv1.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    // http://localhost:8080/v3/api-docs para verificar que la api esta sirviendo al Json de Swagger
    // http://localhost:8080/swagger-ui/index.html Url para poder entrar al swagger con la aplicacion arrancada

    @Bean
    public OpenAPI dndOpenAPI() {
        final String securitySchemeName = "BearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("API Dragones y Mazmorras")
                        .description("Documentación de la API para gestión de personajes, hechizos, clases y más")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Javier González")
                                .email("javigonza97@gmail.com")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}