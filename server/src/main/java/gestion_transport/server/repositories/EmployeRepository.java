package gestion_transport.server.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import gestion_transport.server.entities.Employe;

public interface EmployeRepository extends JpaRepository<Employe, Integer> {
    Optional<Employe> findByEmail(String email);

    Optional<Employe> findByMatricule(String matricule);

    @Query("SELECT e FROM Employe e WHERE e.profil = '1' OR e.profil = '2'")
    List<Employe> getAllChauffeurs();
}
