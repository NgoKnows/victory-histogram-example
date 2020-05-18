import React, { useState } from "react";
import {
  VictoryChart,
  VictoryHistogram,
  VictoryAxis,
  VictoryLabel,
  VictoryTooltip,
} from "victory";
import _ from "lodash";
import "./App.css";
import styled from "styled-components";
import data from "./data/data.json";
import Slider from "./Slider";

const white = "#cfcfcf";
const Container = styled.div`
  background-color: #1a191e;
  padding: 24px;
  overflow: hidden;
`;

const Card = styled.div`
  background-color: #24232a;
  border-radius: 5px;
  padding: 30px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-left: 8px solid #ff719a;
`;

const yearToSeason = (year) => `${year}-${(year + 1 + "").slice(2, 4)}`;

const YEARS = Object.keys(data).map((year) => parseInt(year, 10));
const FIRST_YEAR = YEARS[0];
const LAST_YEAR = YEARS[YEARS.length - 1];
const TOTAL_YEARS = LAST_YEAR - FIRST_YEAR;

const getTooltipText = ({ datum }) => {
  const { binnedData, x0, x1 } = datum;

  const playerCount = binnedData.length;
  const playerNames = binnedData
    .slice(0, 2)
    .map(({ player }) => {
      const [firstName, lastName] = player.split(" ");
      return lastName ? `${firstName.slice(0, 1)}. ${lastName}` : firstName;
    })
    .join(", ");

  return `${playerCount} player${
    playerCount > 1 ? "s" : ""
  } averaged between ${x0}-${x1} 3PT attempts \n (${playerNames}${
    playerCount > 2 ? `, and ${playerCount - 2} more players` : ""
  })`;
};

const sharedAxisStyles = {
  axis: {
    stroke: "transparent",
  },
  tickLabels: {
    fill: white,
    fontSize: 12,
  },
};

function App() {
  const [year, setYear] = useState(FIRST_YEAR);

  return (
    <Container>
      <svg style={{ position: "fixed", opacity: 0 }}>
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFE29F" />
            <stop offset="47%" stopColor="#FFA99F" />
            <stop offset="100%" stopColor="#FF719A" />
          </linearGradient>
        </defs>
      </svg>
      <Card>
        <VictoryChart
          // containerComponent={
          //   <VictoryVoronoiContainer
          //     voronoiDimension="x"
          //     labels={({ datum }) => ""}
          //     labelComponent={
          //       <VictoryTooltip active flyoutComponent={<GraphTooltip />} />
          //     }
          //   />
          // }
          height={260}
        >
          <VictoryLabel
            text={`3pt Attempts Per Game Averages (${yearToSeason(year)})`}
            x={225}
            y={20}
            textAnchor="middle"
            style={{ fill: white }}
          />
          <VictoryAxis
            style={{
              ...sharedAxisStyles,
              grid: {
                fill: white,
                stroke: white,
                pointerEvents: "painted",
                strokeWidth: 0.5,
              },
            }}
            dependentAxis
          />
          <VictoryAxis style={sharedAxisStyles} />
          <VictoryHistogram
            cornerRadius={2}
            domain={{ y: [0, 160] }}
            animate={{ duration: 300 }}
            data={data[year]}
            bins={_.range(0, 16, 2)}
            style={{
              data: {
                stroke: "transparent",
                fill: "url(#gradient1)",
                strokeWidth: 1,
              },
              labels: {
                fill: "red",
              },
            }}
            x="3pa"
            labels={getTooltipText}
            labelComponent={
              <VictoryTooltip
                style={{
                  fill: white,
                  fontSize: 10,
                }}
                flyoutStyle={{
                  fill: "#24232a",
                  stroke: "#FF719A",
                  strokeWidth: 0.5,
                }}
              />
            }
          />
        </VictoryChart>

        <YearSlider year={year} setYear={setYear} />
      </Card>
    </Container>
  );
}

const SliderContainer = styled.div`
  padding: 80px 21px 10px;

  @media (min-width: 800px) {
    padding: 72px 52px 10px;
  }
`;

const getYear = (percent) =>
  Math.round(FIRST_YEAR + TOTAL_YEARS * (percent / 100));

const SEASONS = YEARS.map((year) => yearToSeason(year));

const YearSlider = ({ year, setYear }) => {
  const [value, setValue] = useState(0);

  return (
    <SliderContainer>
      <Slider
        onChange={(newValue) => {
          setValue(newValue);
          const calculatedYear = getYear(newValue);

          if (year !== calculatedYear) {
            setYear(calculatedYear);
          }
        }}
        value={value}
        maxValue={100}
        tooltipValues={SEASONS}
      />
    </SliderContainer>
  );
};

export default App;
