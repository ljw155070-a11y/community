package kr.co.community.main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.co.community.main.service.MainService;

@Controller
@RequestMapping(value = "/mainpage")
public class MainController {

	@Autowired
	private MainService mainService;
	
	
	@GetMapping 
	public String showMain() {
		System.out.println("메인페이지 컨트롤러 실행됨");
		return "mainpage/mainpage";
	}
}
