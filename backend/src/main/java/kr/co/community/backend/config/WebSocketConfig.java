package kr.co.community.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// WebSocket 설정 클래스
@Configuration
@EnableWebSocketMessageBroker // WebSocket 메시지 브로커 활성화
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // 메시지 브로커 설정
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // /topic으로 시작하는 주소를 구독한 클라이언트에게 메시지 전달
        registry.enableSimpleBroker("/topic");
        // /app으로 시작하는 주소로 메시지 보낼 수 있음
        registry.setApplicationDestinationPrefixes("/app");
    }

    // WebSocket 연결 주소 설정
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // /ws 주소로 WebSocket 연결
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*") // 모든 origin 허용
                .withSockJS(); // SockJS 사용
    }
}