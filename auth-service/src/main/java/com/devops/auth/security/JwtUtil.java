package com.devops.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utility class for generating, parsing, and validating JSON Web Tokens (JWT).
 * Uses the JJWT library (io.jsonwebtoken) with HMAC-SHA signing keys.
 */
@Component
public class JwtUtil {

    /**
     * Secret cryptographic key used to sign and verify tokens.
     * Configured via the jwt.secret property in application.yml or environment variable.
     */
    @Value("${jwt.secret}")
    private String secret;

    /**
     * Token validity duration in milliseconds.
     * Configured via the jwt.expiration property in application.yml.
     */
    @Value("${jwt.expiration}")
    private long expiration;

    /**
     * Constructs a SecretKey instance from the raw configured secret bytes.
     *
     * @return SecretKey suitable for HMAC-SHA algorithms.
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates a signed JWT token containing user identity and custom claims.
     *
     * @param userId Unique database identifier of the user.
     * @param email User's email address (used as the token subject).
     * @param name User's display name.
     * @return Compact serialized JWT string.
     */
    public String generateToken(Long userId, String email, String name) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("name", name)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Parses and extracts all claims from a given JWT token.
     *
     * @param token The compact serialized JWT.
     * @return Claims payload containing token claims.
     * @throws JwtException if token signature is invalid or expired.
     */
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extracts the subject (email) from the token.
     *
     * @param token The compact serialized JWT.
     * @return Subject email string.
     */
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extracts the userId claim from the token.
     *
     * @param token The compact serialized JWT.
     * @return User ID as Long, or null if not present.
     */
    public Long extractUserId(String token) {
        Object userId = extractAllClaims(token).get("userId");
        if (userId instanceof Number) {
            return ((Number) userId).longValue();
        }
        return null;
    }

    /**
     * Extracts the user's name claim from the token.
     *
     * @param token The compact serialized JWT.
     * @return User's name string.
     */
    public String extractName(String token) {
        return extractAllClaims(token).get("name", String.class);
    }

    /**
     * Validates whether a token has a valid signature and is not expired.
     *
     * @param token The compact serialized JWT.
     * @return {@code true} if valid, {@code false} otherwise.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
