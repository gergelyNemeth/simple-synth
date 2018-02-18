package com.museme.controller;

import com.museme.model.account.Account;
import com.museme.repository.KeyEventRepository;
import com.museme.repository.MelodyRepository;
import com.museme.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.Valid;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class UserSystemController {

    @Autowired
    KeyEventRepository keyEventRepository;

    @Autowired
    MelodyRepository melodyRepository;

    @Autowired
    AccountService accountService;

    @PreAuthorize("isAnonymous()")
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String renderLogin(Model model) {
        return "login";
    }

    @PreAuthorize("isAnonymous()")
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String serveRegister(Model model, @Valid @ModelAttribute Account account, BindingResult bindingResult) {
        Account nameExists = accountService.findUserByName(account.getUsername());
        Account accountExists = accountService.findUserByEmail(account.getEmail());
        System.out.println(account);
        System.out.println(nameExists);
        if (bindingResult.hasErrors()) {
            return "register";
        }
        if (accountExists == null && nameExists == null) {
            accountService.saveUser(account);
            return "redirect:/login";
        }
        if (nameExists != null) {
            model.addAttribute("error", "*Username is reserved");
        }
        if (accountExists != null) {
            model.addAttribute("error", "*Email address is already registered");
        }
        return "register";
    }

    @PreAuthorize("isAnonymous()")
    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public String registerPage(Model model) {
        model.addAttribute("account", new Account());
        return "register";
    }
}
