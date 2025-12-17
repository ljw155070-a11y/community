package kr.co.community.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

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

      // ✅ 경로별 허용/차단
      .authorizeHttpRequests(auth -> auth
        // SSR 페이지 / 정적 리소스 허용
        .requestMatchers("/", "/index", "/css/**", "/js/**", "/img/**", "/static/**").permitAll()

        // 회원가입/중복체크 API 허용 (만든 경로에 맞춰 열어주기)
        .requestMatchers("/member/**").permitAll()

        // 그 외는 일단 전부 허용(개발단계)
        .anyRequest().permitAll()
      );

    return http.build();
  }
}
