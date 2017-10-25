package controller;

import model.StartEvent;
import model.StopEvent;
import spark.ModelAndView;
import spark.Request;
import spark.Response;
import spark.template.thymeleaf.ThymeleafTemplateEngine;

import java.util.Map;

public class SaveEventController {

    private static SaveEventController saveEventController = null;

    private SaveEventController(){
    }

    public static SaveEventController getInstance() {
        if (saveEventController == null) {
            saveEventController = new SaveEventController();
        }
        return saveEventController;
    }

    public String saveStart(Request req, Response res) {
        System.out.println(req.queryParams("key") + " - " + req.queryParams("startTime"));
        StartEvent startevent = new StartEvent(req.queryParams("key"), Double.parseDouble(req.queryParams("startTime")));
        System.out.println(startevent);
        return "saved";
    }

    public String saveStop(Request req, Response res) {
        System.out.println(req.queryParams("key") + " - " + req.queryParams("stopTime"));
        StopEvent stopevent = new StopEvent(req.queryParams("key"), Double.parseDouble(req.queryParams("stopTime")));
        System.out.println(stopevent);
        return "saved";
    }

    public static String renderTemplate(Map model, String template) {
        return new ThymeleafTemplateEngine().render(new ModelAndView(model, template));
    }
}
