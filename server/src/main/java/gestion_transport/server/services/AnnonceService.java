package gestion_transport.server.services;

import java.util.stream.Stream;

import gestion_transport.server.dto.AnnonceDTO;
import gestion_transport.server.entities.Annonce;
import gestion_transport.server.entities.Employe;

public interface AnnonceService {

    public Annonce addAnnonce(Employe employe, AnnonceDTO annonceDTO);

    public void deleteAnnonce(Employe employe, int id);

    Annonce readAnnonce(Employe e, int id);

    public Annonce updateAnnonce(Employe employe, AnnonceDTO annonceDTO);

    public Stream<Annonce> listAnnonces();

    public Stream<Annonce> listAnnonces(Employe employe);

    public Annonce cancel(Employe employe, int id);

}
