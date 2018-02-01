package com.museme.controller;

import com.museme.dao.KeyEventDao;
import com.museme.dao.KeyEventDaoMem;
import com.museme.model.KeyEvent;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SaveEventController {

    @RequestMapping(value = "/saveStart", method = RequestMethod.POST)
    public String saveStart(@RequestParam("key") String key,
                            @RequestParam("startTime") Double startTime) {
        KeyEventDao keyEventDao = KeyEventDaoMem.getInstance();
        KeyEvent keyEvent = new KeyEvent(key, startTime);
        keyEventDao.add(keyEvent);
        System.out.println(keyEvent);
        return "saved";
    }

    @RequestMapping(value = "/saveStop", method = RequestMethod.PUT)
    public String saveStop(@RequestParam("key") String key,
                           @RequestParam("stopTime") Double stopTime) {
        KeyEventDao keyEventDao = KeyEventDaoMem.getInstance();
        KeyEvent keyEvent = keyEventDao.find(key);
        keyEvent.setStopTime(stopTime);
        System.out.println(keyEvent);
        System.out.println(keyEventDao.getAll());
        return "saved";
    }

    @RequestMapping(value = "/deleteLoop", method = RequestMethod.DELETE)
    public String clearAll() {
        KeyEventDao keyEventDao = KeyEventDaoMem.getInstance();
        keyEventDao.clear();
        return "cleared";
    }

}
