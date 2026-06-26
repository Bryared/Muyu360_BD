package com.tramite.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tramite.backend.entity.Remitente;

public interface RemitenteRepository extends JpaRepository<Remitente, Integer> {
}
