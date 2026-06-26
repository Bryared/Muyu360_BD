package com.tramite.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cargo")
@Data
public class Cargo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cargo")
    private Integer idCargo;

    @Column(nullable = false, length = 100)
    private String nombre;
}