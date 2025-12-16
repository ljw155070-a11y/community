package kr.co.community.main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.co.community.main.service.MainService;

@Controller
@RequestMapping(value = "/Main")
public class MainController {

	@Autowired
	private MainService mainService;
}
