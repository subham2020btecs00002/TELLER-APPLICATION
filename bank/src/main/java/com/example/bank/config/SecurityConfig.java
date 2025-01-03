package com.example.bank.config;

import com.example.bank.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/customers").hasAuthority("ROLE_MAKER")
                .requestMatchers(HttpMethod.POST, "/api/accounts").hasAuthority("ROLE_MAKER")
                .requestMatchers(HttpMethod.GET, "/api/accounts/customer/**").hasAuthority("ROLE_MAKER")
                .requestMatchers(HttpMethod.POST, "/api/transactions").hasAuthority("ROLE_MAKER")
                .requestMatchers(HttpMethod.GET, "/api/transactions/pending").hasAnyAuthority("ROLE_AUTHORIZER","ROLE_CHECKER")
                .requestMatchers(HttpMethod.PUT, "/api/transactions/{transactionId}/approve").hasAuthority("ROLE_AUTHORIZER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtAuthorizationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> 
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
            );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    private static class JwtAuthorizationFilter extends OncePerRequestFilter {
        private final JwtUtil jwtUtil;

        public JwtAuthorizationFilter(JwtUtil jwtUtil) {
            this.jwtUtil = jwtUtil;
        }

@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
    try {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);

            // Validate and extract roles from the JWT token
            String roles = jwtUtil.extractRole(token);

            if (roles != null) {
                var authorities = roles.replace("[", "").replace("]", "").split(",");
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(
                                null,
                                null,
                                java.util.Arrays.stream(authorities)
                                        .map(String::trim)
                                        .map(SimpleGrantedAuthority::new)
                                        .collect(Collectors.toList())
                        )
                );
            }
        }

        // Proceed to the next filter in the chain
        chain.doFilter(request, response);
    } catch (io.jsonwebtoken.ExpiredJwtException ex) {
        // Handle ExpiredJwtException explicitly
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("JWT token has expired. Please log in again.");
        response.getWriter().flush();
    } catch (Exception ex) {
        // Handle all other exceptions
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Unauthorized access. " + ex.getMessage());
        response.getWriter().flush();
    }
}
    }
}
