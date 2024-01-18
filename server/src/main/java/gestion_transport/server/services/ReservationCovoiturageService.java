package gestion_transport.server.services;

import java.util.stream.Stream;

import gestion_transport.server.dto.ReservationCovoiturageDTO;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.entities.ReservationCovoiturage;

public interface ReservationCovoiturageService {

        public ReservationCovoiturage addReservation(Employe employe,
                        ReservationCovoiturageDTO ReservationCovoiturageDTO);

        public void deleteReservation(Employe employe, int id);

        ReservationCovoiturage readReservation(Employe employe, int id);

        public Stream<ReservationCovoiturage> listReservation(Employe employe);

        public ReservationCovoiturage cancel(Employe employe, int id);
}
