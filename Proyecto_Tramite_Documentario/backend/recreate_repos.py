import os

repo_dir = r"c:\Users\bryan\Muyu360_BD\Proyecto_Tramite_Documentario\backend\src\main\java\com\tramite\backend\repository"

entities = [
    "Area",
    "Cargo",
    "Derivacion",
    "Documento",
    "Empleado",
    "EstadoDocumento",
    "PalabraClave",
    "Remitente",
    "Respuesta",
    "TipoDocumento",
    "TipoRespuesta"
]

template = """package com.tramite.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tramite.backend.entity.{entity};

public interface {entity}Repository extends JpaRepository<{entity}, Integer> {{
}}
"""

for entity in entities:
    filepath = os.path.join(repo_dir, f"{entity}Repository.java")
    with open(filepath, 'w') as f:
        f.write(template.format(entity=entity))
