import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import dataCSV from '../data/cleaned_loksabha_1962_2019.csv';

const CloseContests = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    d3.csv(dataCSV).then(data => {
      // Filter for 2019 and contests with valid margin%
      const filtered = data
        .filter(d => +d.year === 2019 && d['margin%'] && !isNaN(+d['margin%']))
        .map(d => ({ ...d, marginPercent: +d['margin%'] }));

      // Sort by smallest margin%
      const sorted = filtered.sort((a, b) => a.marginPercent - b.marginPercent).slice(0, 15);

      setContests(sorted);
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Top 15 Closest Contests (2019)</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Constituency</th>
            <th className="border px-2 py-1">Candidate</th>
            <th className="border px-2 py-1">Party</th>
            <th className="border px-2 py-1">Margin (%)</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((d, i) => (
            <tr key={i} className="hover:bg-gray-100">
              <td className="border px-2 py-1">{d.Pc_name}</td>
              <td className="border px-2 py-1">{d.candidate_name}</td>
              <td className="border px-2 py-1">{d.party_standardized}</td>
              <td className="border px-2 py-1">{d.marginPercent.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CloseContests;
