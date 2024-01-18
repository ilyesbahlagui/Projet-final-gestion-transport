package gestion_transport.server.services;

import java.util.stream.Stream;

import gestion_transport.server.entities.Categorie;

public interface CategorieService {

    Categorie readCategorie(int id);

    public Stream<Categorie> listCategories();
}
