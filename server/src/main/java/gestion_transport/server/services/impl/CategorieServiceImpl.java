package gestion_transport.server.services.impl;

import java.util.stream.Stream;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gestion_transport.server.entities.Categorie;
import gestion_transport.server.repositories.CategorieRepository;
import gestion_transport.server.services.CategorieService;
import lombok.AllArgsConstructor;

@Service
@Transactional // This ensures everything gets persisted to the DB.
@EnableScheduling
@AllArgsConstructor
public class CategorieServiceImpl implements CategorieService {
    private CategorieRepository categorieRepository;

    @Override
    public Categorie readCategorie(int id) {
        return categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("La catégorie n'existe pas."));
    }

    @Override
    public Stream<Categorie> listCategories() {
        return categorieRepository.findAll().stream();
    }
    
}
