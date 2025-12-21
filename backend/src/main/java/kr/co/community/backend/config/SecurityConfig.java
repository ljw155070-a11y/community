package kr.co.community.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .formLogin(form -> form.disable())
      .httpBasic(basic -> basic.disable())
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .authorizeHttpRequests(auth -> auth

        // ✅ 정적 리소스 전체 허용 (Boot 기본 static 위치 포함)
        .requestMatchers(
            "/", "/index", "/index.html",
            "/css/**", "/js/**", "/img/**", "/images/**",
            "/static/**",
            "/favicon.ico",
            "/assets/**"         // (혹시 /assets 로 나갈 때)
        ).permitAll()

        // ✅ React (CSR) 정적 리소스 + 라우팅 진입점 허용
        .requestMatchers("/app/**").permitAll()

        // ✅ SSR 페이지들
        .requestMatchers("/mainpage", "/board/**", "/terms/**", "/notice/**").permitAll()

        // ✅ API
        .requestMatchers("/member/**").permitAll()
        .requestMatchers("/settings/**").permitAll()  // 추가

        .anyRequest().permitAll()
      );

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration configuration = new CorsConfiguration();

      configuration.setAllowedOrigins(List.of(
          "http://localhost:3000",
          "http://localhost:5173",
          "http://54.206.33.199:9999"
      ));

      configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
      configuration.setAllowedHeaders(Arrays.asList("*"));
      configuration.setAllowCredentials(true);

      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration);
      return source;
  }

  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
  }
}