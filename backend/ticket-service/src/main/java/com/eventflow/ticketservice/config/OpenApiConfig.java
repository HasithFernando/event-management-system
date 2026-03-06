package com.eventflow.ticketservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI ticketServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ticket Service API")
                        .description("REST API for managing event tickets in the EventFlow platform. " +
                                "Supports ticket purchasing, cancellation, PDF download with QR codes, " +
                                "and capacity management.")
                        .version("v0.1.0")
                        .contact(new Contact()
                                .name("EventFlow Team")
                                .email("support@eventflow.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("API Gateway"),
                        new Server().url("http://localhost:8084").description("Direct Ticket Service")
                ));
    }
}
