package com.museme.controller;

import com.museme.model.Melody;
import com.museme.repository.KeyEventRepository;
import com.museme.repository.MelodyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @RequestMapping(value = "/feed", method = RequestMethod.GET)
    public String museFeed(Model model) {
        List<Melody> melodies = melodyRepository.findAll();
        model.addAttribute("melodies", melodies);
        return "feed";
    }

}
