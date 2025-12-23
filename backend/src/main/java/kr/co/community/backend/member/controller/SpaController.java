package kr.co.community.backend.member.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    /**
     * React 클라이언트 라우트를 index.html로 포워딩
     * (주소창 직접 입력, 새로고침 대응)
     */
    @GetMapping({
        "/login",
        "/signup",
        "/find-id",
        "/find-password",
        "/about",
        "/profile",
        "/boardwrite",
        "/alert",
        "/settings",
        "/admin/**"
    })
    public String forwardToReact() {
        return "forward:/app/index.html";
    }
}
