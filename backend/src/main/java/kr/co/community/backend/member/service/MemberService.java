package kr.co.community.backend.member.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.community.backend.member.dao.MemberDao;

@Service
public class MemberService {
	
	@Autowired
	private MemberDao memberDao;

}
