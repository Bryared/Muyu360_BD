package com.tramite.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tramite.backend.entity.Derivacion;
import java.util.List;

public interface DerivacionRepository extends JpaRepository<Derivacion, Integer> {
    List<Derivacion> findByDocumento_IdDocumento(Integer idDocumento);
}
