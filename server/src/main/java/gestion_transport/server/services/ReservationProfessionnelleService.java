package gestion_transport.server.services;

import java.util.stream.Stream;

import gestion_transport.server.dto.ReservationProfessionnelleDTO;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.entities.ReservationProfessionnelle;

public interface ReservationProfessionnelleService {

        public ReservationProfessionnelle addReservation(Employe employe,
                        ReservationProfessionnelleDTO reservationProfessionnelleDTO);

        public void deleteReservation(Employe employe, int id);

        ReservationProfessionnelle readReservation(Employe e, int id);

        public ReservationProfessionnelle updateReservation(Employe employe,
                        ReservationProfessionnelleDTO reservationProfessionnelleDTO);

        public Stream<ReservationProfessionnelle> listReservationsVehicule(int vehiculeSocieteId);

        public Stream<ReservationProfessionnelle> listReservations(Employe employe);
}
