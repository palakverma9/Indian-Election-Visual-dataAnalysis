import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import dataCSV from '../data/cleaned_loksabha_1962_2019.csv';

const TurnoutAnalysis = () => {
  const svgRef = useRef();

  useEffect(() => {
    d3.csv(dataCSV).then(data => {
      const grouped = d3.rollups(
        data,
        v => d3.mean(v, d => +d.Turnout),
        d => +d.year
      ).map(([year, turnout]) => ({ year, turnout }));

      // Setup
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      const width = 800, height = 400, margin = { top: 30, right: 30, bottom: 50, left: 60 };

      const x = d3.scaleLinear()
        .domain(d3.extent(grouped, d => d.year))
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(grouped, d => d.turnout)])
        .range([height - margin.bottom, margin.top]);

      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg.append("path")
        .datum(grouped)
        .attr("fill", "none")
        .attr("stroke", "#0ea5e9")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
          .x(d => x(d.year))
          .y(d => y(d.turnout))
        );
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Average Voter Turnout Over Time</h2>
      <svg ref={svgRef} width={800} height={400}></svg>
    </div>
  );
};

export default TurnoutAnalysis;
