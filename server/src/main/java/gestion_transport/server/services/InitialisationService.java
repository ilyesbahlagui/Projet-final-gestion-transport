package gestion_transport.server.services;

import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import gestion_transport.server.entities.Annonce;
import gestion_transport.server.entities.Categorie;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.entities.ReservationCovoiturage;
import gestion_transport.server.entities.ReservationProfessionnelle;
import gestion_transport.server.entities.VehiculeSociete;
import gestion_transport.server.enums.ProfilEmployeEnum;
import gestion_transport.server.enums.StatutAnnonceEnum;
import gestion_transport.server.enums.StatutVehiculeEnum;
import gestion_transport.server.repositories.AnnonceRepository;
import gestion_transport.server.repositories.CategorieRepository;
import gestion_transport.server.repositories.EmployeRepository;
import gestion_transport.server.repositories.ReservationCovoiturageRepository;
import gestion_transport.server.repositories.ReservationProfessionnelleRepository;
import gestion_transport.server.repositories.VehiculeSocieteRepository;

import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import lombok.AllArgsConstructor;

import javax.transaction.Transactional;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

@Component
@AllArgsConstructor
public class InitialisationService {
    // TODO: use services where possible.
    private EmployeRepository employeRepository;
    private AnnonceRepository annonceRepository;
    private VehiculeSocieteRepository vehiculeRepository;
    private ReservationCovoiturageRepository reservationCovoiturageRepository;
    private ReservationProfessionnelleRepository reservationProfessionnelleRepository;
    private CategorieRepository categorieRepository;

    private void populateUsers() {

        Annonce annonce = new Annonce();
        annonce.setAdresseDepart("Adresse de départ");
        annonce.setAdresseDestination("Adresse de destination");
        annonce.setImmatriculation("BP-999-AA");
        annonce.setMarque("Marque du véhicule");
        annonce.setModele("Modèle du véhicule");
        annonce.setPlaceDisponible(4);
        LocalDateTime date = LocalDateTime.now().plusHours(1);
        date = date.withMinute((date.getMinute() / 10) * 10);
        date = date.withSecond(0);
        date = date.withNano(0);
        ZoneId zoneId = ZoneId.systemDefault(); // Vous pouvez utiliser un fuseau horaire spécifique si nécessaire
        ZonedDateTime zonedDateTime = ZonedDateTime.of(date, zoneId);
        annonce.setDate(zonedDateTime.toInstant());
        annonce.setStatut(StatutAnnonceEnum.CONFIRME);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        Employe employe = new Employe()
                .setMatricule("M12343")
                .setEmail("employe@example.com")
                .setPassword(passwordEncoder.encode("password123"))
                .setFirstName("Stan")
                .setLastName("Smith")
                .setProfil(ProfilEmployeEnum.COLLABORATEUR)
                .setPhone("1234567890")
                .setPermis("B")
                .setPhoto("path/to/photo");
        employeRepository.save(employe);

        annonce.setEmploye(employe);
        annonceRepository.save(annonce);

        Employe chauffeur = new Employe()
                .setMatricule("M12344")
                .setEmail("chauffeur@example.com")
                .setPassword(passwordEncoder.encode("password123"))
                .setFirstName("John")
                .setLastName("Doe")
                .setProfil(ProfilEmployeEnum.CHAUFFEUR)
                .setPhone("1234567890")
                .setPermis("B")
                .setPhoto("path/to/photo");
        employeRepository.save(chauffeur);

        Employe admin = new Employe()
                .setMatricule("M12345")
                .setEmail("admin@example.com")
                .setPassword(passwordEncoder.encode("password123"))
                .setFirstName("Bill")
                .setLastName("Gates")
                .setProfil(ProfilEmployeEnum.ADMINISTRATEUR)
                .setPhone("1234567890")
                .setPermis("B")
                .setPhoto("path/to/photo");
        employeRepository.save(admin);

        VehiculeSociete vehiculeSociete = populateVehicule();
        populateReservations(employe, annonce, vehiculeSociete);
        populateChauffeurReservations(chauffeur, employe, annonce, vehiculeSociete);
    }

    private VehiculeSociete populateVehicule() {
        Categorie microUrbaines = new Categorie("Micro-urbaines");
        Categorie miniCitadines = new Categorie("Mini-citadines");
        Categorie citadinesPolyvalentes = new Categorie("Citadines polyvalentes");
        Categorie compactes = new Categorie("Compactes");
        Categorie berlinesTailleS = new Categorie("Berlines Taille S");
        Categorie berlinesTailleM = new Categorie("Berlines Taille M");
        Categorie berlinesTailleL = new Categorie("Berlines Taille L");
        Categorie suvToutTerrainsPickup = new Categorie("SUV, Tout-terrains et Pick-up");

        categorieRepository.save(microUrbaines);
        categorieRepository.save(miniCitadines);
        categorieRepository.save(citadinesPolyvalentes);
        categorieRepository.save(compactes);
        categorieRepository.save(berlinesTailleS);
        categorieRepository.save(berlinesTailleM);
        categorieRepository.save(berlinesTailleL);
        categorieRepository.save(suvToutTerrainsPickup);

        VehiculeSociete vehicule = new VehiculeSociete();
        vehicule.setImmatriculation("AA-489-EZ");
        vehicule.setMarque("Marque du véhicule");
        vehicule.setModele("Modèle du véhicule");
        vehicule.setPlaceDisponible(4);
        vehicule.setPhoto("https://images.caradisiac.com/images/4/2/5/9/204259/S0-voitures-neuves-les-promotions-de-septembre-2023-769451.jpg");
        vehicule.setStatut(StatutVehiculeEnum.EN_SERVICE);
        vehicule.setCategorie(microUrbaines);
        vehicule.setLatitude(48);
        vehicule.setLongitude(1.97);
        vehiculeRepository.save(vehicule);

        return vehicule;
    }

    private void populateReservations(Employe employe, Annonce annonce, VehiculeSociete vehiculeSociete) {
        ReservationCovoiturage reservation = new ReservationCovoiturage();
        reservation.setAnnonce(annonce);
        reservation.setStatut(StatutAnnonceEnum.CONFIRME);
        reservation.setEmploye(employe);
        reservationCovoiturageRepository.save(reservation);

        ReservationProfessionnelle reservationProfessionnelle = new ReservationProfessionnelle();
        reservationProfessionnelle.setDateDebut(Instant.now().plus(Period.ofDays(1)));
        reservationProfessionnelle.setDateFin(Instant.now().plus(Period.ofDays(2)));
        reservationProfessionnelle.setVehicule(vehiculeSociete);
        reservationProfessionnelle.setStatut(StatutAnnonceEnum.CONFIRME);
        reservationProfessionnelle.setEmploye(employe);
        reservationProfessionnelleRepository.save(reservationProfessionnelle);
    }

    private void populateChauffeurReservations(Employe chauffeur, Employe responsable, Annonce annonce, VehiculeSociete vehicule)
    {
        ReservationProfessionnelle reservation = new ReservationProfessionnelle();
        reservation.setEmploye(responsable);
        reservation.setConducteur(chauffeur);
        reservation.setNeedsChauffeur(true);
        reservation.setDateDebut(annonce.getDate());
        reservation.setDateFin(annonce.getDate());
        reservation.setVehicule(vehicule);

        reservationProfessionnelleRepository.save(reservation);

        reservation = new ReservationProfessionnelle();
        reservation.setEmploye(responsable);
        reservation.setNeedsChauffeur(true);
        reservation.setDateDebut(annonce.getDate().plus(4, ChronoUnit.HOURS));
        reservation.setDateFin(reservation.getDateDebut().plus(2, ChronoUnit.HOURS));
        reservation.setVehicule(vehicule);

        reservationProfessionnelleRepository.save(reservation);

        // Not visible.
        reservation = new ReservationProfessionnelle();
        reservation.setEmploye(responsable);
        reservation.setNeedsChauffeur(false);
        reservation.setDateDebut(annonce.getDate().plus(Period.ofDays(1)));
        reservation.setDateFin(reservation.getDateDebut().plus(3, ChronoUnit.HOURS));
        reservation.setVehicule(vehicule);

        reservationProfessionnelleRepository.save(reservation);
    }

    @EventListener(ContextRefreshedEvent.class)
    @Transactional
    public void populateDatabase() throws IOException {
        populateUsers();
    }

}
