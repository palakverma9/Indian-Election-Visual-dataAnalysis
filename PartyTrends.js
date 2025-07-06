import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import dataCSV from '../data/cleaned_loksabha_1962_2019.csv';

const PartyTrends = () => {
  const svgRef = useRef();

  useEffect(() => {
    d3.csv(dataCSV).then(data => {
      // Prepare data
      const partySet = new Set(["BJP", "INC", "CPI", "CPI(M)", "SP", "BSP"]);
      const filtered = data.filter(d => partySet.has(d.party_standardized) && d.year);

      // Aggregate votes per party per year
      const aggregated = d3.rollups(
        filtered,
        v => d3.sum(v, d => +d.votes),
        d => d.year,
        d => d.party_standardized
      );

      // Convert to array of objects
      const years = Array.from(new Set(filtered.map(d => d.year))).sort();
      const parties = Array.from(partySet);
      const formatted = years.map(year => {
        const entry = { year };
        const yearData = aggregated.find(d => d[0] === year);
        if (yearData) {
          yearData[1].forEach(([party, votes]) => {
            entry[party] = votes;
          });
        }
        return entry;
      });

      // Set up SVG
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      const width = 800, height = 400, margin = { top: 30, right: 50, bottom: 50, left: 60 };

      const x = d3.scaleLinear()
        .domain(d3.extent(years))
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(formatted, d => d3.max(parties, p => +d[p] || 0))])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const color = d3.scaleOrdinal()
        .domain(parties)
        .range(d3.schemeCategory10);

      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      // Line generator
      const line = d3.line()
        .x(d => x(+d.year))
        .y((d, i, arr) => y(+d.value || 0));

      parties.forEach(party => {
        const partyData = formatted.map(d => ({ year: +d.year, value: d[party] }));
        svg.append("path")
          .datum(partyData)
          .attr("fill", "none")
          .attr("stroke", color(party))
          .attr("stroke-width", 2)
          .attr("d", d3.line()
            .x(d => x(d.year))
            .y(d => y(d.value || 0))
          );

        svg.append("text")
          .attr("x", width - margin.right)
          .attr("y", y(partyData[partyData.length - 1].value || 0))
          .attr("fill", color(party))
          .text(party)
          .style("font-size", "12px")
          .style("alignment-baseline", "middle");
      });
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Historical Party Performance</h2>
      <svg ref={svgRef} width={800} height={400}></svg>
    </div>
  );
};

export default PartyTrends;
