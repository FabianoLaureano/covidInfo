import { useEffect, useState } from "react";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";

import { LeafletMouseEvent } from "leaflet";

import api from "../../services/api";

import markerImg from "../../images/marker.svg";

import 'leaflet/dist/leaflet.css';

import Leaflet from "leaflet";

import './styles.css';

import countries from '../../utils/countries';

type cType = {
    Country: string;
	TotalConfirmed: number;
    TotalDeaths: number;
}

export function Home(){
    const [country, setCountry] = useState([]);
    const [globalinfo, setGlobalInfo] = useState(Object);

    const marker = Leaflet.icon({
        iconUrl: markerImg,
        iconSize: [28, 38],
        iconAnchor: [14, 38],
        popupAnchor: [230, 20],
    });

    useEffect(() => {
        api.get('summary').then(response => {
            const data = response.data.Countries;
            setCountry(data);
            setGlobalInfo(response.data.Global);
        })
    }, []);

    function LocationMarker() {
        const [position, setPosition] = useState({ latitude: -15.020311819926441, longitude: -49.48242187500001})
        const map = useMapEvents({
          click() {
            map.on('click', function(e : LeafletMouseEvent) {
                const { lat, lng } = e.latlng;
                setPosition({ latitude: lat, longitude: lng })
            });
          },
          //locationfound(e : LocationEvent) {
            //var { lat, lng } = e.latlng;
            //const { lat, lng } = e.latlng;
            //setPosition({ latitude: lat, longitude: lng })
            //map.flyTo(e.latlng, map.getZoom())
          //},
        })
        
        return position === null ? null : (
            <Marker position={[position.latitude, position.longitude]} icon={marker}>
                <Popup>You are here</Popup>
            </Marker>
        )
    }

    return (
        <div id="page-map">
            <aside>
                <header>
                    <h2>Casos confirmados em todo mundo</h2>
                    <p>{globalinfo.TotalConfirmed}</p>

                    <h2>Casos fatais em todo mundo</h2>
                    <p>{globalinfo.TotalDeaths}</p>
                </header>
            </aside>
            
            <MapContainer
                center={[-11.5968181, -62.1480035]}
                zoom={3.5}
                style={{ width: "100%", height: "100%", background: "#aad3df" }}
            >
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {country.map((c : cType) => {
                    if (countries[c.Country]) {
                        return (                        
                            <Marker position={[countries[c.Country][0], countries[c.Country][1]]} icon={marker}>
                                <Popup closeButton={false} minWidth={400} maxWidth={400} className="map-popup">
                                    Total de casos confirmados : {c.TotalConfirmed.toLocaleString('pt-BR')}
                                    <br />
                                    Total de obitos : {c.TotalDeaths.toLocaleString('pt-BR')}
                                </Popup>
                            </Marker>                 
                        )
                    }                    
                })}

            </MapContainer>

        </div>
    );
};