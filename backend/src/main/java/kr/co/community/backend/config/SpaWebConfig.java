package kr.co.community.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    
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
