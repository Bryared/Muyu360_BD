package com.tramite.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tramite.backend.entity.Cargo;

public interface CargoRepository extends JpaRepository<Cargo, Integer> {
}
