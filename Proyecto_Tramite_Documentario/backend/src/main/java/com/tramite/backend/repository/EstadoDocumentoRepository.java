package com.tramite.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tramite.backend.entity.EstadoDocumento;

public interface EstadoDocumentoRepository extends JpaRepository<EstadoDocumento, Integer> {
}
