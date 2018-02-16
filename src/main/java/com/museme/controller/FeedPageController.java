package com.museme.controller;

import com.museme.model.Melody;
import com.museme.model.account.Account;
import com.museme.repository.AccountRepository;
import com.museme.repository.KeyEventRepository;
import com.museme.repository.MelodyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@Controller
public class FeedPageController {

    @Autowired
    KeyEventRepository keyEventRepository;

    @Autowired
    MelodyRepository melodyRepository;

    @Autowired
    AccountRepository accountRepository;

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @RequestMapping(value = "/feed", method = RequestMethod.GET)
    public String museFeed(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Account account = accountRepository.findByEmail(email);
        if (account != null) {
            model.addAttribute("username", account.getUsername());
        }
        List<Melody> melodies = melodyRepository.findAll();
        model.addAttribute("melodies", melodies);
        return "feed";
    }

}
