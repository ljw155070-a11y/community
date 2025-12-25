package kr.co.community.backend.minigame.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/minigame")
public class MiniGameController {

    @GetMapping("/apple")
    public String appleGamePage() {
        return "minigame/applegame";
    }
}