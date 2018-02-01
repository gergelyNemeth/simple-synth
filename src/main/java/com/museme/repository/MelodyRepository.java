package com.museme.repository;

import com.museme.model.Melody;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MelodyRepository extends JpaRepository<Melody, Integer>{
}
