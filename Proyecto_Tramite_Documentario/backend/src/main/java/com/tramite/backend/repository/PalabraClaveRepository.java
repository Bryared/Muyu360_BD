package com.tramite.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tramite.backend.entity.PalabraClave;

public interface PalabraClaveRepository extends JpaRepository<PalabraClave, Integer> {
}
