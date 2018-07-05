package com.museme;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

//for jsr310 java 8 java.time.*
@EntityScan(
        basePackageClasses = {MuseMeApp.class, Jsr310JpaConverters.class}
)
@SpringBootApplication
public class MuseMeApp {

    public static void main(String[] args) {
        SpringApplication.run(MuseMeApp.class, args);
    }

}
