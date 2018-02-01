package com.museme.repository;

import com.museme.model.KeyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface KeyEventRepository extends JpaRepository<KeyEvent, Integer>{
    KeyEvent getKeyEventByKeyAndStopTimeIsNull(@Param("key") String key);
}
