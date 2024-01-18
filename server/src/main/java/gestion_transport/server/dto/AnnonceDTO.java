package gestion_transport.server.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.Instant;

import gestion_transport.server.entities.Annonce;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.enums.StatutAnnonceEnum;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
public class AnnonceDTO {
    private int id;
    private String adresseDepart;
    private String adresseDestination;
    private String immatriculation;
    private String marque;
    private String modele;
    private int placeDisponible;
    private Instant date;
    private String statut;
    private int employeID;

    public AnnonceDTO(Annonce annonce) {
        id = annonce.getId();
        adresseDepart = annonce.getAdresseDepart();
        adresseDestination = annonce.getAdresseDestination();
        immatriculation = annonce.getImmatriculation();
        marque = annonce.getMarque();
        modele = annonce.getModele();
        placeDisponible = annonce.getPlaceDisponible();
        date = annonce.getDate();
        statut = annonce.getStatut().name();
        employeID = annonce.getEmploye().getId();
    }

    public Annonce toEntity(Employe employe) {
        Annonce annonce = new Annonce();
        annonce.setId(this.getId());
        annonce.setAdresseDepart(this.getAdresseDepart());
        annonce.setAdresseDestination(this.getAdresseDestination());
        annonce.setImmatriculation(this.getImmatriculation());
        annonce.setMarque(this.getMarque());
        annonce.setModele(this.getModele());
        annonce.setPlaceDisponible(this.getPlaceDisponible());
        annonce.setDate(this.getDate());
        annonce.setStatut(StatutAnnonceEnum.valueOf(this.getStatut()));
        annonce.setEmploye(employe);
        return annonce;
    }
}
