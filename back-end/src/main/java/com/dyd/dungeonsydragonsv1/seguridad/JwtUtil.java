package com.dyd.dungeonsydragonsv1.seguridad;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;               // tu cadena con tildes, guiones, etc.

    @Value("${jwt.expiration}")
    private long expirationSeconds;

    private Key key;

    @PostConstruct
    public void init() {
        // convertimos el String directamente a bytes UTF-8
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        // generamos la Key HMAC-SHA256
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generarToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationSeconds * 1000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extraerUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
