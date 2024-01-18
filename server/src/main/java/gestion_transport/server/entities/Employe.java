package gestion_transport.server.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import gestion_transport.server.dto.EmployeDTO;
import gestion_transport.server.enums.ProfilEmployeEnum;

@Entity
@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class Employe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    @Column(unique = true, length = 50, nullable = false)
    private String matricule;

    @NotNull
    @Column(unique = true, length = 50, nullable = false)
    private String email;

    @NotNull
    @Column(nullable = false)
    private String password;

    @NotNull
    @Column(length = 50, nullable = false)
    private String firstName;

    @NotNull
    @Column(length = 50, nullable = false)
    private String lastName;

    @NotNull
    @Column(nullable = false)
    private ProfilEmployeEnum profil = ProfilEmployeEnum.COLLABORATEUR;

    @NotNull
    @Pattern(regexp = "\\d{10}", message = "Le numéro de téléphone doit être composé de 10 chiffres")
    @Column(length = 10, nullable = false)
    private String phone;

    @NotNull
    @Column(length = 10, nullable = false)
    private String permis;

    @Column(nullable = true)
    private String photo;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "employe")
    private Set<Annonce> annonces;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "employe")
    private Set<Reservation> reservations;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "conducteur")
    private Set<ReservationProfessionnelle> reservationsChauffeur;

    public EmployeDTO toDTO() {
        EmployeDTO dto = new EmployeDTO();
        dto.setId(this.getId());
        dto.setMatricule(this.getMatricule());
        dto.setEmail(this.getEmail());
        dto.setFirstName(this.getFirstName());
        dto.setLastName(this.getLastName());
        dto.setProfil(this.getProfil().name());
        dto.setPhone(this.getPhone());
        dto.setPermis(this.getPermis());
        dto.setPhoto(this.getPhoto());
        return dto;
    }
}
