import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import dataCSV from '../data/cleaned_loksabha_1962_2019.csv';

const RegionalDominance = () => {
  const [dominance, setDominance] = useState([]);

  useEffect(() => {
    d3.csv(dataCSV).then(data => {
      const latest = data.filter(d => +d.year === 2019);
      const grouped = d3.rollups(
        latest,
        v => d3.rollup(v, x => x.length, d => d.party_standardized),
        d => d.state
      ).map(([state, partyMap]) => {
        const [party, count] = [...partyMap.entries()].reduce((a, b) => a[1] > b[1] ? a : b);
        return { state, dominant_party: party, seats: count };
      });

      setDominance(grouped);
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">State-wise Dominant Party (2019)</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">State</th>
            <th className="border px-2 py-1">Party</th>
            <th className="border px-2 py-1">Seats</th>
          </tr>
        </thead>
        <tbody>
          {dominance.map((d, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{d.state}</td>
              <td className="border px-2 py-1">{d.dominant_party}</td>
              <td className="border px-2 py-1">{d.seats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegionalDominance;
