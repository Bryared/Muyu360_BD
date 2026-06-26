package com.tramite.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tramite.backend.entity.Documento;

public interface DocumentoRepository extends JpaRepository<Documento, Integer> {
}
