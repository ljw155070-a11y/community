package kr.co.community.backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      // (개발 단계) REST에서 보통 꺼두고 시작함
      .csrf(csrf -> csrf.disable())

      // ✅ 기본 로그인 폼(Please sign in) 비활성화
      .formLogin(form -> form.disable())
      .httpBasic(basic -> basic.disable())
      
      // ✅ CORS 설정 활성화
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))

      // ✅ 경로별 허용/차단
      .authorizeHttpRequests(auth -> auth
        // SSR 페이지 / 정적 리소스 허용
        .requestMatchers("/", "/index", "/css/**", "/js/**", "/img/**", "/static/**",  "/board/**", "/terms/**").permitAll()
        
        // 회원가입/중복체크 API 허용 (만든 경로에 맞춰 열어주기)
        .requestMatchers("/member/**").permitAll()

        // 그 외는 일단 전부 허용(개발단계)
        .anyRequest().permitAll()
      );

    return http.build();
  }
  

  /**
   * CORS 설정 (React 개발 서버와 통신)
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration configuration = new CorsConfiguration();
      
      // React 개발 서버 주소
      configuration.setAllowedOrigins(Arrays.asList(
          "http://localhost:3000",
          "http://localhost:5173"
      ));
      
      configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
      configuration.setAllowedHeaders(Arrays.asList("*"));
      configuration.setAllowCredentials(true);
      
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration);
      return source;
  }

}
