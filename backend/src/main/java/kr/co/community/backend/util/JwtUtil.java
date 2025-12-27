package kr.co.community.backend.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long accessTokenValidityMs = 1000L * 60 * 60 * 24; // 24시간

    public JwtUtil(@Value("${jwt.secret-key}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * JWT 토큰 생성
     */
    public String generateToken(Long memberId, String email, String name, String nickname) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenValidityMs);

        return Jwts.builder()
                .setSubject(String.valueOf(memberId))
                .claim("email", email)
                .claim("name", name)
                .claim("nickname", nickname)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * JWT 토큰에서 memberId 추출
     */
    public Long getMemberIdFromToken(String token) {
        Claims claims = parseToken(token);
        return Long.parseLong(claims.getSubject());
    }

    /**
     * JWT 토큰에서 email 추출
     */
    public String getEmailFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("email", String.class);
    }

    /**
     * JWT 토큰에서 name 추출
     */
    public String getNameFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("name", String.class);
    }

    /**
     * JWT 토큰에서 nickname 추출
     */
    public String getNicknameFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("nickname", String.class);
    }

    /**
     * JWT 토큰에서 만료시간 추출
     * 
     * [중복 로그인] DB에 세션 저장할 때 만료시간 필요해서 추가
     * - 로그인 시 새 세션 저장할 때 사용
     * - LOGIN_SESSION.EXPIRE_TIME에 저장됨
     */
    public Date getExpirationFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.getExpiration();  // 토큰의 만료 시간 반환
    }

    /**
     * JWT 토큰 파싱
     */
    private Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * JWT 토큰 유효성 검증
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (ExpiredJwtException e) {
            // 토큰 만료
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            // 유효하지 않은 토큰
            return false;
        }
    }
}