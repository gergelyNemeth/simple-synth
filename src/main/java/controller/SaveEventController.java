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
        KeyEventDao keyEventDao = KeyEventDaoMem.getInstance();
        KeyEvent keyEvent = new KeyEvent(req.queryParams("key"), Double.parseDouble(req.queryParams("startTime")));
        keyEventDao.add(keyEvent);
        System.out.println(keyEvent);
        return "saved";
    }

    public String saveStop(Request req, Response res) {
        KeyEventDao keyEventDao = KeyEventDaoMem.getInstance();
        KeyEvent keyEvent = keyEventDao.find(req.queryParams("key"));
        keyEvent.setStopTime(Double.parseDouble(req.queryParams("stopTime")));
        System.out.println(keyEvent);
        System.out.println(keyEventDao.getAll());
        return "saved";
    }

    public String clearAll(Request req, Response res) {
        KeyEventDao keyEventDao = KeyEventDaoMem.getInstance();
        keyEventDao.clear();
        return "cleared";
    }

    public static String renderTemplate(Map model, String template) {
        return new ThymeleafTemplateEngine().render(new ModelAndView(model, template));
    }
}
