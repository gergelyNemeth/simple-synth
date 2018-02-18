package com.museme.service;

import com.museme.model.account.Account;
import com.museme.model.account.Role;
import com.museme.repository.AccountRepository;
import com.museme.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.Date;

@Service
public class AccountServiceImpl implements AccountService {

    @Qualifier("accountRepository")
    @Autowired
    private AccountRepository accountRepository;

    @Qualifier("roleRepository")
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void saveUser(Account account) {
        account.setPassword(bCryptPasswordEncoder.encode(account.getPassword()));
        account.setActive(true);
        account.setMemberSince(new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        Role role = roleRepository.findByRole("USER");
        account.addRole(role);
        accountRepository.save(account);
    }

    @Override
    public Account findUserByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    @Override
    public Account findUserByName(String username) {
        return accountRepository.findByUsername(username);
    }
}
