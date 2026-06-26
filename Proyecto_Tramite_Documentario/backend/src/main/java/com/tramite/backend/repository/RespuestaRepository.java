package com.tramite.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tramite.backend.entity.Respuesta;

public interface RespuestaRepository extends JpaRepository<Respuesta, Integer> {
}
