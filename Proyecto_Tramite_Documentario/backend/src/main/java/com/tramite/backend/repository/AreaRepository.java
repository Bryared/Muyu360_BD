package com.tramite.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tramite.backend.entity.Area;

public interface AreaRepository extends JpaRepository<Area, Integer> {
}
