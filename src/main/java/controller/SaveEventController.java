package controller;

import dao.KeyEventDao;
import dao.KeyEventDaoMem;
import model.KeyEvent;
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
        KeyEventDao noteDao = KeyEventDaoMem.getInstance();
        KeyEvent keyEvent = new KeyEvent(req.queryParams("key"), Double.parseDouble(req.queryParams("startTime")));
        noteDao.add(keyEvent);
        System.out.println(keyEvent);
        return "saved";
    }

    public String saveStop(Request req, Response res) {
        KeyEventDao noteDao = KeyEventDaoMem.getInstance();
        KeyEvent keyEvent = noteDao.find(req.queryParams("key"));
        keyEvent.setStopTime(Double.parseDouble(req.queryParams("stopTime")));
        System.out.println(keyEvent);
        System.out.println(noteDao.getAll());
        return "saved";
    }

    public static String renderTemplate(Map model, String template) {
        return new ThymeleafTemplateEngine().render(new ModelAndView(model, template));
    }
}
