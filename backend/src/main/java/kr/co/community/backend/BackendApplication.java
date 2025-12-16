package kr.co.community.backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "kr.co.community") // 구조가 틀려서 추가
@MapperScan("kr.co.community") // 왜 틀려진건지 모르겠음;; 이렇게 하니까 오류안떠요
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
