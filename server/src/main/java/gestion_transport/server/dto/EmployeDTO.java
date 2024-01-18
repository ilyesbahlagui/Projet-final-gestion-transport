package gestion_transport.server.dto;

import gestion_transport.server.entities.Employe;
import gestion_transport.server.enums.ProfilEmployeEnum;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
public class EmployeDTO {
    private int id;
    private String matricule;
    private String email;
    private String firstName;
    private String lastName;
    private String profil;
    private String phone;
    private String permis;
    private String photo;

    public EmployeDTO(Employe employe) {
        this.id = employe.getId();
        this.matricule = employe.getMatricule();
        this.email = employe.getEmail();
        this.firstName = employe.getFirstName();
        this.lastName = employe.getLastName();
        this.profil = employe.getProfil().name();
        this.phone = employe.getPhone();
        this.permis = employe.getPermis();
        this.photo = employe.getPhone();
    }

    public Employe toEntity() {
        Employe employe = new Employe();
        employe.setId(this.getId());
        employe.setMatricule(this.getMatricule());
        employe.setEmail(this.getEmail());
        employe.setFirstName(this.getFirstName());
        employe.setLastName(this.getLastName());
        employe.setProfil(ProfilEmployeEnum.valueOf(this.getProfil()));
        employe.setPhone(this.getPhone());
        employe.setPermis(this.getPermis());
        employe.setPhoto(this.getPhoto());
        return employe;
    }
}
