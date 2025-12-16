package kr.co.community.backend.main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.co.community.backend.main.service.MainService;

@Controller
@RequestMapping(value = "/mainpage")
public class MainController {

	@Autowired
	private MainService mainService;
	
	
	@GetMapping 
	public String showMain() {
		return "mainpage/mainpage";
	}
}
