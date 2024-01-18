package gestion_transport.server.entities;

import gestion_transport.server.dto.VehiculeSocieteDTO;
import gestion_transport.server.enums.StatutVehiculeEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Entity
@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class VehiculeSociete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    @Pattern(regexp = "^[A-Z]{2}-\\d{3}-[A-Z]{2}$", message = "Le format d'immatriculation est invalide")
    @Column(length = 10, nullable = false)
    private String immatriculation;

    @NotNull
    @Column(length = 50, nullable = false)
    private String marque;

    @NotNull
    @Column(length = 50, nullable = false)
    private String modele;

    @NotNull
    @Min(value = 1, message = "Le nombre de places disponibles doit être supérieur à zéro")
    @Column(nullable = false)
    private int placeDisponible;

    @NotNull
    @Column(nullable = false)
    private String photo;

    @NotNull
    @Column(nullable = false)
    private StatutVehiculeEnum statut;

    @NotNull
    @Column(nullable = false)
    private double latitude = 46.603354;

    @NotNull
    @Column(nullable = false)
    private double longitude = 1.888334;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    public VehiculeSocieteDTO toDTO() {
        VehiculeSocieteDTO dto = new VehiculeSocieteDTO();
        dto.setId(this.getId());
        dto.setImmatriculation(this.getImmatriculation());
        dto.setMarque(this.getMarque());
        dto.setModele(this.getModele());
        dto.setPlaceDisponible(this.getPlaceDisponible());
        dto.setPhoto(this.getPhoto());
        dto.setStatut(this.getStatut().name());
        dto.setCategorieID(this.getCategorie().getId());
        dto.setLatitude(this.getLatitude());
        dto.setLongitude(this.getLongitude());
        return dto;
    }
}