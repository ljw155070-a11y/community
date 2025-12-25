package kr.co.community.backend.config;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;
    
    @Value("${file.upload.path:C:/uploads/community}")
    private String uploadPath;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                    "/api/**",
                    "/static/**",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/error/**",
                    "/uploads/**"   // ✅ 업로드 이미지 인터셉터 제외
                );
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
        		.addResourceLocations("file:///" + uploadPath + "/");
    }
}
