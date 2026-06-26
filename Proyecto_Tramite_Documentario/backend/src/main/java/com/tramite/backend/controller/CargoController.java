package com.tramite.backend.controller;

import com.tramite.backend.entity.Cargo;
import com.tramite.backend.repository.CargoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cargos")
@CrossOrigin(origins = "*")
public class CargoController {

    private final CargoRepository cargoRepository;

    public CargoController(CargoRepository cargoRepository) {
        this.cargoRepository = cargoRepository;
    }

    @GetMapping
    public ResponseEntity<List<Cargo>> listarCargos() {
        return ResponseEntity.ok(cargoRepository.findAll());
    }
}
