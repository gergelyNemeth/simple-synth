package com.museme.utils;

import com.museme.model.account.Account;
import com.museme.model.account.Role;
import com.museme.repository.AccountRepository;
import com.museme.repository.RoleRepository;
import com.museme.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountService accountService;

    @Override
    public void run(String... strings) throws Exception {
        Role admin = new Role("ADMIN");
        Role user = new Role("USER");
        roleRepository.save(admin);
        roleRepository.save(user);

        Account gergoAcc = new Account("gergo@museme.com", "anything");
        gergoAcc.addRole(roleRepository.findByRole("ADMIN"));
        accountService.saveUser(gergoAcc);

        Account petiAcc = new Account("peti@museme.com", "anythingElse");
        accountService.saveUser(petiAcc);

    }
}
