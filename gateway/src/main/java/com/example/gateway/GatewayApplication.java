package com.example.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("springboot3-security-service", r -> r.path("/auth/**")
                .uri("lb://SPRINGBOOT3-SECURITY"))
            .route("bank-service", r -> r.path("/api/accounts/**")
                .uri("lb://BANK"))
            .route("bank-service", r -> r.path("/api/customers/**")
                .uri("lb://BANK"))
            .route("bank-service", r -> r.path("/api/transactions/**")
                .uri("lb://BANK"))
            .build();
    }
}
