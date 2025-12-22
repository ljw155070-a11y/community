package kr.co.community.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpaWebConfig implements WebMvcConfigurer {
	
	// ============================================
    // CORS 설정 - 개발용
    // ============================================
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 경로에 대해
                .allowedOriginPatterns("*")  // 모든 출처 허용
                .allowedMethods("*")         // GET, POST, PUT, DELETE 등 모든 메소드 허용
                .allowedHeaders("*")         // 모든 헤더 허용
                .allowCredentials(false);    // 인증 정보 주고받기 OFF
    }

    // ============================================
    // CORS 설정 - 배포용 (주석)
    // ============================================
    // 배포시: 위 개발용 주석처리, 아래 주석 해제
	//    @Override
	//    public void addCorsMappings(CorsRegistry registry) {
	//        registry.addMapping("/**")
	//                .allowedOrigins("http://54.206.33.199:5173")  // 배포 서버만 허용
	//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
	//                .allowedHeaders("*")
	//                .allowCredentials(true);  // 인증 정보 주고받기 ON
	//    }
    
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {

        // /app
        registry.addViewController("/app")
                .setViewName("forward:/app/index.html");

        // /app/xxx  (확장자 없는 것만)
        registry.addViewController("/app/{x:[^\\.]*}")
                .setViewName("forward:/app/index.html");

        // /app/xxx/yyy (확장자 없는 것만)
        registry.addViewController("/app/{x:[^\\.]*}/{y:[^\\.]*}")
                .setViewName("forward:/app/index.html");

        // 필요하면 더 추가 가능: 3뎁스, 4뎁스...
        registry.addViewController("/app/{x:[^\\.]*}/{y:[^\\.]*}/{z:[^\\.]*}")
                .setViewName("forward:/app/index.html");
    }
}
