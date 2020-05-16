import React, { useState, useMemo } from "react";
import {
  VictoryChart,
  VictoryHistogram,
  VictoryAxis,
  VictoryLabel,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import _ from "lodash";
import "./App.css";
import styled from "styled-components";
import data1990 from "./data/1990-91.json";
import data1991 from "./data/1991-92.json";
import data1992 from "./data/1992-93.json";
import data1993 from "./data/1993-94.json";
import data1994 from "./data/1994-95.json";
import data1995 from "./data/1995-96.json";
import data1996 from "./data/1996-97.json";
import data1997 from "./data/1997-98.json";
import data1998 from "./data/1998-99.json";
import data1999 from "./data/1999-00.json";
import data2000 from "./data/2000-01.json";
import data2001 from "./data/2001-02.json";
import data2002 from "./data/2002-03.json";
import data2003 from "./data/2003-04.json";
import data2004 from "./data/2004-05.json";
import data2005 from "./data/2005-06.json";
import data2006 from "./data/2006-07.json";
import data2007 from "./data/2007-08.json";
import data2008 from "./data/2008-09.json";
import data2009 from "./data/2009-10.json";
import data2010 from "./data/2010-11.json";
import data2011 from "./data/2011-12.json";
import data2012 from "./data/2012-13.json";
import data2013 from "./data/2013-14.json";
import data2014 from "./data/2014-15.json";
import data2015 from "./data/2015-16.json";
import data2016 from "./data/2016-17.json";
import data2017 from "./data/2017-18.json";
import data2018 from "./data/2018-19.json";
import data2019 from "./data/2019-20.json";
import Foo from "./Slider";

const data = {
  1990: data1990,
  1991: data1991,
  1992: data1992,
  1993: data1993,
  1994: data1994,
  1995: data1995,
  1996: data1996,
  1997: data1997,
  1998: data1998,
  1999: data1999,
  2000: data2000,
  2001: data2001,
  2002: data2002,
  2003: data2003,
  2004: data2004,
  2005: data2005,
  2006: data2006,
  2007: data2007,
  2008: data2008,
  2009: data2009,
  2010: data2010,
  2011: data2011,
  2012: data2012,
  2013: data2013,
  2014: data2014,
  2015: data2015,
  2016: data2016,
  2017: data2017,
  2018: data2018,
  2019: data2019,
};

const white = "#cfcfcf";
const Container = styled.div`
  background-color: #1a191e;
  padding: 50px;
`;

const Card = styled.div`
  background-color: #24232a;
  border-radius: 5px;
  padding: 30px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-color: #ff719a;
  border-left-width: 10px;
  border-left-style: solid;
`;

const yearToSeason = (year) => {
  return `${year}-${(year + 1 + "").slice(2, 4)}`;
};

const YEARS = Object.keys(data).map((year) => parseInt(year, 10));
const FIRST_YEAR = 1990;
const LAST_YEAR = 2019;
const TOTAL_YEARS = LAST_YEAR - FIRST_YEAR;

const Tooltip = styled.div`
  background-color: yellow;
  transform: translate(-50%, -50%);
`;
export class GraphTooltip extends React.Component {
  render() {
    const { datum, x, y } = this.props;
    return (
      <g style={{ pointerEvents: "none" }}>
        <foreignObject x={x} y={y} width="350" height="300">
          <Tooltip>
            <span>{datum.binnedData.length}</span>
          </Tooltip>
        </foreignObject>
      </g>
    );
  }
}

function App() {
  const [year, setYear] = useState(FIRST_YEAR);

  return (
    <Container className="App">
      <svg>
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
          style={{
            parent: {
              overflow: "visible",
            },
          }}
        >
          <VictoryLabel
            text={`3pt Attempt Averages (${yearToSeason(year)})`}
            x={225}
            y={30}
            textAnchor="middle"
            style={{ fill: white }}
          />
          <VictoryAxis
            style={{
              axis: {
                stroke: "transparent",
              },
              tickLabels: {
                fill: white,
                fontSize: 12,
              },
              grid: {
                fill: white,
                stroke: white,
                pointerEvents: "painted",
                strokeWidth: 0.5,
              },
            }}
            dependentAxis
          />
          <VictoryAxis
            style={{
              axis: {
                stroke: "transparent",
              },
              tickLabels: {
                fill: white,
                fontSize: 12,
              },
            }}
          />
          <VictoryHistogram
            cornerRadius={2}
            domain={{ y: [0, 160] }}
            animate={{
              duration: 300,
            }}
            data={data[year]}
            bins={_.range(0, 16, 2)}
            style={{
              data: {
                stroke: "transparent",
                fill: "url(#gradient1)",
                strokeWidth: 1,
                mixBlendMode: "normal",
                vectorEffect: "non-scaling-stroke",
              },
              labels: {
                fill: "red",
              },
            }}
            x="3pa"
            labels={({ datum }) =>
              `${datum.binnedData.length} player${
                datum.binnedData.length > 1 ? "s" : ""
              } averaged \n between ${datum.x0}-${
                datum.x1
              } 3PT attempts \n ${datum.binnedData
                .slice(0, 3)
                .map(({ player }) => player)
                .join(", ")}`
            }
            labelComponent={
              <VictoryTooltip
                style={{
                  fill: white,
                  fontSize: 11,
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
      </Card>
      <Slider year={year} setYear={setYear} />
    </Container>
  );
}

const SliderContainer = styled.div`
  background-color: #24232a;
  margin-top: 24px;
  padding: 80px 50px 50px;
  border-radius: 5px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-color: #ff719a;
  border-left-width: 10px;
  border-left-style: solid;
`;

const getYear = (percent) =>
  Math.round(FIRST_YEAR + TOTAL_YEARS * (percent / 100));

const Slider = ({ year, setYear }) => {
  const [percent, setPercent] = useState(0);

  return (
    <SliderContainer>
      <Foo
        onChange={(p) => {
          setPercent(p);
          const calculatedYear = getYear(percent);

          if (year !== calculatedYear) {
            setYear(calculatedYear);
          }
        }}
        value={percent}
        maxValue={100}
        tooltipValues={YEARS.map((year) => yearToSeason(year))}
      />
    </SliderContainer>
  );
};

export default App;
