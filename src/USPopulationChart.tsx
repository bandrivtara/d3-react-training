// @ts-nocheck

import { csv, DSVRowArray, max, scaleBand, scaleLinear } from "d3";
import { useEffect, useState } from "react";

const USPopulationChart = () => {
  const CSV_URL =
    "https://gist.githubusercontent.com/bandrivtara/f03f721cd8e3ed3f58f5f2da6f0b62e4/raw/976d1309876d04f23c3bf874f83d983d6622fd93/UN_population.csv";
  const height = 600;
  const width = 900;
  const margin = { top: 20, bottom: 20, left: 200, right: 20 };

  const [data, setData] = useState<DSVRowArray<any> | null>(null);

  useEffect(() => {
    const row = (d: DSVRowArray<any>): DSVRowArray<any> => {
      d.Population = +d["2020"];
      return d;
    };

    csv(CSV_URL, row).then((d) => {
      setData(d?.slice(0, 10));
    });
  }, []);

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const yScale = data
    ? scaleBand()
        .domain(data?.map((d) => d.Country))
        .range([0, innerHeight])
    : 0;

  const xScale = data
    ? scaleLinear()
        .domain([0, max(data, (d) => d.Population)])
        .range([0, innerWidth])
    : 0;
  console.log(data && yScale.domain());
  console.log(data && xScale(100000));

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {data &&
            xScale.ticks().map((tickValue) => (
              <g
                key={tickValue}
                transform={`translate(${xScale(tickValue)}, 0)`}
              >
                <line y2={innerHeight} stroke="red" />
                <text
                  y={innerHeight + 3}
                  dy=".71em"
                  style={{ textAnchor: "middle" }}
                >
                  {tickValue}
                </text>
              </g>
            ))}
          {data &&
            yScale.domain().map((tickValue) => (
              <text
                key={tickValue}
                y={yScale(tickValue) + yScale.bandwidth() / 2}
                x="-3"
                dy=".32em"
                style={{ textAnchor: "end" }}
              >
                {tickValue}
              </text>
            ))}
          {data?.map((d) => (
            <rect
              key={d.Country}
              x={0}
              y={yScale(d.Country)}
              width={xScale(d.Population)}
              height={yScale.bandwidth()}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default USPopulationChart;
