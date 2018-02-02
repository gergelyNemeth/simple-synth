package com.museme.controller;

import com.museme.dao.KeyEventDaoMem;
import com.museme.model.KeyEvent;
import com.museme.model.Melody;
import com.museme.repository.KeyEventRepository;
import com.museme.repository.MelodyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SaveEventController {

    @Autowired
    KeyEventDaoMem keyEventDao;

    @Autowired
    KeyEventRepository keyEventRepository;

    @Autowired
    MelodyRepository melodyRepository;

    @RequestMapping(value = "/saveStart", method = RequestMethod.POST)
    public String saveStart(@RequestParam("key") String key,
                            @RequestParam("startTime") Double startTime,
                            @RequestParam("note") String note,
                            @RequestParam("octave") String octave) {
        KeyEvent keyEvent = new KeyEvent(key, startTime);
        keyEvent.setNote(note);
        keyEvent.setOctave(octave);
        keyEventDao.add(keyEvent);
        System.out.println(keyEvent);
        return "saved";
    }

    @RequestMapping(value = "/saveStop", method = RequestMethod.PUT)
    public String saveStop(@RequestParam("key") String key,
                           @RequestParam("stopTime") Double stopTime) {
        KeyEvent keyEvent = keyEventDao.find(key);
        keyEvent.setStopTime(stopTime);
        System.out.println(keyEvent);
        System.out.println(keyEventDao.getAll());
        return "saved";
    }

    @RequestMapping(value = "/deleteLoop", method = RequestMethod.DELETE)
    public String clearAll() {
        keyEventDao.clear();
        return "CLEARED";
    }

    @RequestMapping(value = "/saveLoop", method = RequestMethod.POST)
    public String saveLoop() {
        Melody melody = new Melody(140);
        melodyRepository.save(melody);
        for (KeyEvent keyEvent : keyEventDao.getAll()) {
            keyEvent.setMelody(melody);
            keyEventRepository.save(keyEvent);
        }
        return "LOOP SAVED";
    }

}
