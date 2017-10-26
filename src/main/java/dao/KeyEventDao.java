package dao;

import model.KeyEvent;

import java.util.List;

public interface KeyEventDao {
    void add(KeyEvent keyEvent);
    KeyEvent find(String key);
    List<KeyEvent> getAll();
    void clear();
}
