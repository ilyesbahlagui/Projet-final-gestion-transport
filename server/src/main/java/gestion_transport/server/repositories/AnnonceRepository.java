package gestion_transport.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import gestion_transport.server.entities.Annonce;
import gestion_transport.server.entities.Employe;

import java.util.List;


public interface AnnonceRepository extends JpaRepository<Annonce, Integer> {
    List<Annonce> findByEmploye(Employe employe);
}
