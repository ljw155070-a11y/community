package kr.co.community.backend.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.community.backend.main.dao.MainDao;

@Service
public class MainService {
	@Autowired
	private MainDao mainDao;
}
