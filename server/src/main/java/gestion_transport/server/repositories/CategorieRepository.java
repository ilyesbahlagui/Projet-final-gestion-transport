package gestion_transport.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import gestion_transport.server.entities.Categorie;

public interface CategorieRepository extends JpaRepository<Categorie, Integer> {
}
