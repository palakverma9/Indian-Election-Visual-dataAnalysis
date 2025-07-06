import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as d3 from 'd3';
import electionData from '../data/cleaned_loksabha_1962_2019.csv';

const ConstituencyMap = () => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    Promise.all([
      d3.csv(electionData),
      fetch(process.env.PUBLIC_URL + '/data/india_pc_2019_simplified.geojson').then(res => res.json())
    ]).then(([csv, geo]) => {
      const data2019 = csv.filter(d => +d.year === 2019);
      const colorMap = {
        BJP: "#ff9933", INC: "#00aaff", SP: "#cc0099",
        BSP: "#9933ff", CPI: "#ff0000", "CPI(M)": "#800000"
      };

      geo.features.forEach(f => {
        const match = data2019.find(d =>
          f.properties.pc_name &&
          d.Pc_name &&
          f.properties.pc_name.toLowerCase().includes(d.Pc_name.toLowerCase())
        );
        f.properties.party = match?.party_standardized || "OTHER";
        f.properties.color = colorMap[match?.party_standardized] || "#cccccc";
      });

      setFeatures(geo.features);
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">2019 Constituency Map</h2>
      <MapContainer center={[22, 80]} zoom={4} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          data={{ type: "FeatureCollection", features }}
          style={feature => ({
            fillColor: feature.properties.color,
            color: "#333",
            weight: 0.5,
            fillOpacity: 0.7
          })}
          onEachFeature={(feature, layer) => {
            layer.bindTooltip(`
              <strong>${feature.properties.pc_name}</strong><br/>
              Party: ${feature.properties.party}
            `, { sticky: true });
          }}
        />
      </MapContainer>
    </div>
  );
};

export default ConstituencyMap;
