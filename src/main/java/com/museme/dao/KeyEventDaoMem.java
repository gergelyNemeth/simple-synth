package com.museme.dao;

import com.museme.model.KeyEvent;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class KeyEventDaoMem implements KeyEventDao {

    private static List<KeyEvent> DATA = new ArrayList<>();

    @Override
    public void add(KeyEvent keyEvent) {
        DATA.add(keyEvent);
    }

    @Override
    public KeyEvent find(String key) {
        return DATA.stream()
                .filter(n -> n.getKey().equals(key))
                .filter(n -> n.getStopTime() == null)
                .findFirst().orElse(null);
    }

    @Override
    public List<KeyEvent> getAll() {
        return DATA;
    }

    @Override
    public void clear() {
        DATA.clear();
    }

}
