package com.museme.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SynthPageController {

    @PreAuthorize("hasAnyAuthority('USER')")
    @RequestMapping(value="/")
    public String playgroundPage() {
        return "index";
    }

}


