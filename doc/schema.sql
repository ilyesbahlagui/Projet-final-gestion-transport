CREATE DATABASE IF NOT EXISTS `gestion-transport`;
USE `gestion-transport`;

CREATE TABLE IF NOT EXISTS `annonce` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adresseDepart` varchar(255) NOT NULL,
  `adresseDestination` varchar(255) NOT NULL,
  `date` datetime(6) NOT NULL,
  `immatriculation` varchar(10) NOT NULL,
  `marque` varchar(50) NOT NULL,
  `modele` varchar(50) NOT NULL,
  `placeDisponible` int(11) NOT NULL,
  `statut` int(11) NOT NULL,
  `employe_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKc8e85dnijln2noembn769kerw` (`employe_id`),
  CONSTRAINT `FKc8e85dnijln2noembn769kerw` FOREIGN KEY (`employe_id`) REFERENCES `employe` (`id`)
);

CREATE TABLE IF NOT EXISTS `categorie` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `employe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `matricule` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `permis` varchar(10) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `profil` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_o55w1lond12rsh0qdrlro7km5` (`email`),
  UNIQUE KEY `UK_jcyxn03yg2iulob12ami4anj9` (`matricule`)
);

CREATE TABLE IF NOT EXISTS `reservationcovoiturage` (
  `id` int(11) NOT NULL,
  `statut` int(11) NOT NULL,
  `employe_id` int(11) NOT NULL,
  `annonce_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbw5lxrisf7ftitqktxm5vf77l` (`annonce_id`),
  KEY `FK_kjgm9p6lihfsq6r55i9o7ntkc` (`employe_id`),
  CONSTRAINT `FK_kjgm9p6lihfsq6r55i9o7ntkc` FOREIGN KEY (`employe_id`) REFERENCES `employe` (`id`),
  CONSTRAINT `FKbw5lxrisf7ftitqktxm5vf77l` FOREIGN KEY (`annonce_id`) REFERENCES `annonce` (`id`)
);

CREATE TABLE IF NOT EXISTS `reservationprofessionnelle` (
  `id` int(11) NOT NULL,
  `statut` int(11) NOT NULL,
  `employe_id` int(11) NOT NULL,
  `dateDebut` datetime(6) NOT NULL,
  `dateFin` datetime(6) NOT NULL,
  `needsChauffeur` bit(1) NOT NULL,
  `conducteur_id` int(11) DEFAULT NULL,
  `vehicule_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK187twc6y6dc45a4tecxt7kgoj` (`conducteur_id`),
  KEY `FK2ubhgmdoxlwj5oc0gq3q571j4` (`vehicule_id`),
  KEY `FK_ovb9kdpxbw4d1y1q2lxsn5waj` (`employe_id`),
  CONSTRAINT `FK187twc6y6dc45a4tecxt7kgoj` FOREIGN KEY (`conducteur_id`) REFERENCES `employe` (`id`),
  CONSTRAINT `FK2ubhgmdoxlwj5oc0gq3q571j4` FOREIGN KEY (`vehicule_id`) REFERENCES `vehiculesociete` (`id`),
  CONSTRAINT `FK_ovb9kdpxbw4d1y1q2lxsn5waj` FOREIGN KEY (`employe_id`) REFERENCES `employe` (`id`)
);

CREATE TABLE IF NOT EXISTS `vehiculesociete` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `immatriculation` varchar(10) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `marque` varchar(50) NOT NULL,
  `modele` varchar(50) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `placeDisponible` int(11) NOT NULL,
  `statut` int(11) NOT NULL,
  `categorie_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKr2vkcifysr2che5c1m1bbsjrf` (`categorie_id`),
  CONSTRAINT `FKr2vkcifysr2che5c1m1bbsjrf` FOREIGN KEY (`categorie_id`) REFERENCES `categorie` (`id`)
);
