package com.tramite.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tramite.backend.entity.Empleado;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
}
