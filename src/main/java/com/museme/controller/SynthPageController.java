package com.museme.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SynthPageController {

    @RequestMapping(value="/")
    public String playGroundPage() {
        return "index";
    }

}

