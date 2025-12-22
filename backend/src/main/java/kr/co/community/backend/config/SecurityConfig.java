package kr.co.community.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // ✅ 외부(또는 다른 Config)에서 등록된 CorsConfigurationSource 빈을 주입받아 사용
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // ✅ CORS 활성화 (주입된 설정 사용)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            // ✅ JWT/REST 구성 시 보통 비활성화
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            .authorizeHttpRequests(auth -> auth

                // ✅ 정적 리소스 전체 허용 (Boot 기본 static 위치 포함)
                .requestMatchers(
                    "/", "/index", "/index.html",
                    "/favicon.ico",
                    "/static/**",
                    "/css/**", "/js/**",
                    "/img/**", "/images/**",
                    "/assets/**"
                ).permitAll()

                // ✅ React (CSR) 정적 리소스 + 라우팅 진입점 허용
                .requestMatchers("/app/**").permitAll()

                // ✅ SSR 페이지들
                .requestMatchers(
                    "/mainpage", "/mainpage/**",
                    "/board/**",
                    "/terms/**",
                    "/notice/**"
                ).permitAll()

                // ✅ API (네 프로젝트 라우팅 기준)
                .requestMatchers("/api/**").permitAll()
                .requestMatchers("/member/**").permitAll()
                .requestMatchers("/settings/**").permitAll()

                // ✅ 나머지도 일단 허용 (필요 시 authenticated()로 변경)
                .anyRequest().permitAll()
            );

        return http.build();
    }

    // ✅ MemberService에서 PasswordEncoder로 주입받기 좋게 타입 통일
  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
  }
}
