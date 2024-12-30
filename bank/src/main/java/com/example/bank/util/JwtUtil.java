package com.example.bank.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;

@Component
public class JwtUtil {
    private static final String SECRET = "eIrDszByR2pf91AEH8gxEY8/zG1olILPA/PLV9sJN4E=";

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        System.out.println(claims);
        return claims.get("roles", String.class);
    }
}
