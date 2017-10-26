package dao;

import model.KeyEvent;

import java.util.ArrayList;
import java.util.List;

public class KeyEventDaoMem implements KeyEventDao {

    private static KeyEventDaoMem keyEventDao = null;
    private static List<KeyEvent> DATA = new ArrayList<>();

    public static KeyEventDaoMem getInstance() {
        if (keyEventDao == null) {
            keyEventDao = new KeyEventDaoMem();
        }
        return keyEventDao;
    }

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
