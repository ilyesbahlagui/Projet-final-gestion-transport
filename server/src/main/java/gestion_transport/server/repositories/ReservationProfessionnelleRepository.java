package gestion_transport.server.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import gestion_transport.server.entities.Employe;
import gestion_transport.server.entities.ReservationProfessionnelle;
import gestion_transport.server.entities.VehiculeSociete;

public interface ReservationProfessionnelleRepository extends JpaRepository<ReservationProfessionnelle, Integer> {

    List<ReservationProfessionnelle> findByEmploye(Employe employe);

    @Query("SELECT r FROM ReservationProfessionnelle r " +
    "WHERE r.vehicule = :vehicule " +
    "AND r.statut != '1'")
    List<ReservationProfessionnelle> findReservationVehicule(@Param("vehicule") VehiculeSociete vehiculeSociete);
    
    @Query("SELECT r FROM ReservationProfessionnelle r WHERE r.vehicule.id = :vehiculeId AND r.statut = 'CONFIRME' AND r.dateDebut > CURRENT_TIMESTAMP")
    List<ReservationProfessionnelle> getReservationInProgress(int vehiculeId);

    @Query("select r from ReservationProfessionnelle r where r.conducteur = null and r.needsChauffeur = true")
    List<ReservationProfessionnelle> listUnassigned();
}
