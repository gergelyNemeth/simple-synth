package com.museme.controller;

import com.museme.model.account.Account;
import com.museme.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SynthPageController {

    @Autowired
    AccountRepository accountRepository;

    @PreAuthorize("hasAnyAuthority('USER')")
    @RequestMapping(value = "/")
    public String playgroundPage(Model model) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Account account = accountRepository.findByEmail(email);

        if (account != null) {
            model.addAttribute("username", account.getUsername());
        }

        return "playground";
    }

}


