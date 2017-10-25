package controller;

import spark.ModelAndView;
import spark.Request;
import spark.Response;
import spark.template.thymeleaf.ThymeleafTemplateEngine;

import java.util.HashMap;
import java.util.Map;

public class SynthPageController {

    private static SynthPageController synthPageController = null;
    private SynthPageController(){
    }

    public static SynthPageController getInstance() {
        if (synthPageController == null) {
            synthPageController = new SynthPageController();
        }
        return synthPageController;
    }

    public Object render(Request req, Response res) {
        return renderTemplate(new HashMap(), "index.html");
    }

    public static String renderTemplate(Map model, String template) {
        return new ThymeleafTemplateEngine().render(new ModelAndView(model, template));
    }

}


