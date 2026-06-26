package com.tramite.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tramite.backend.entity.TipoDocumento;

public interface TipoDocumentoRepository extends JpaRepository<TipoDocumento, Integer> {
}
