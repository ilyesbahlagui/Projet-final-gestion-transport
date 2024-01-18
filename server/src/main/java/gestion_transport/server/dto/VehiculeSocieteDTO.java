package gestion_transport.server.dto;

import gestion_transport.server.entities.Categorie;
import gestion_transport.server.entities.VehiculeSociete;
import gestion_transport.server.enums.StatutVehiculeEnum;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
public class VehiculeSocieteDTO {
    private int id;
    private String immatriculation;
    private String marque;
    private String modele;
    private int placeDisponible;
    private String photo;
    private String statut;
    private int categorieID;
    private double latitude;
    private double longitude;

    public VehiculeSocieteDTO(VehiculeSociete vehiculeSociete) {
        this.id = vehiculeSociete.getId();
        this.immatriculation = vehiculeSociete.getImmatriculation();
        this.marque = vehiculeSociete.getMarque();
        this.modele = vehiculeSociete.getModele();
        this.placeDisponible = vehiculeSociete.getPlaceDisponible();
        this.photo = vehiculeSociete.getPhoto();
        this.statut = vehiculeSociete.getStatut().name();
        this.categorieID = vehiculeSociete.getCategorie().getId();
        this.latitude = vehiculeSociete.getLatitude();
        this.longitude = vehiculeSociete.getLongitude();
    }

    public VehiculeSociete toEntity(Categorie categorie) {
        VehiculeSociete vehiculeSociete = new VehiculeSociete();
        vehiculeSociete.setId(this.getId());
        vehiculeSociete.setImmatriculation(this.getImmatriculation());
        vehiculeSociete.setMarque(this.getMarque());
        vehiculeSociete.setModele(this.getModele());
        vehiculeSociete.setPlaceDisponible(this.getPlaceDisponible());
        vehiculeSociete.setPhoto(this.getPhoto());
        vehiculeSociete.setStatut(StatutVehiculeEnum.valueOf(this.getStatut()));
        vehiculeSociete.setCategorie(categorie);
        vehiculeSociete.setLatitude(this.getLatitude());
        vehiculeSociete.setLongitude(this.getLongitude());
        return vehiculeSociete;
    }
}
