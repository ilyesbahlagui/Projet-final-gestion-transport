package gestion_transport.server.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import gestion_transport.server.entities.Employe;
import gestion_transport.server.entities.ReservationCovoiturage;

public interface ReservationCovoiturageRepository extends JpaRepository<ReservationCovoiturage, Integer> {

    List<ReservationCovoiturage> findByEmploye(Employe employe);
}