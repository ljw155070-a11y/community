package kr.co.community.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.community.main.dao.MainDao;

@Service
public class MainService {
	@Autowired
	private MainDao mainDao;
}
