import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useStateAsync } from '../../../../lib/react';
import { AppContext } from '../../../../App';
import L from 'leaflet';
import icon from './../../../../assets/img/marker-vehicule.webp';

const iconVehicule = new L.Icon({
    iconUrl: icon,
    iconSize: [32, 36],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const GeolocalisationVehicules: React.FC = () => {
    const [vehicules] = useStateAsync(() => AppContext.services.vehicule.getAll());
    const position: [number, number] = [46.603354, 1.888334]; // Centre de la France

    return (
        <Container className="pt-3">
            <div className="text-start">
                <Link to="/admin/vehicules" className="mb-3">
                    Retour à la liste
                </Link>
            </div>
            <h2 className="text-start pt-3">Géolocalisation des véhicules</h2>
            <MapContainer center={position} zoom={6} style={{ height: '500px' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {vehicules?.data?.map((vehicule, index) => (
                    <Marker 
                        key={index}
                        position={[vehicule.latitude, vehicule.longitude]}
                        icon={iconVehicule}>
                        <Tooltip>{vehicule.immatriculation}</Tooltip>
                    </Marker>
                ))}
            </MapContainer>
        </Container>
    );
};

export default GeolocalisationVehicules;