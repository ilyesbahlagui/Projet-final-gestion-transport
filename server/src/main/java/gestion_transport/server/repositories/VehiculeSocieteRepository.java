package gestion_transport.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import gestion_transport.server.entities.VehiculeSociete;

public interface VehiculeSocieteRepository extends JpaRepository<VehiculeSociete, Integer> {
}