import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

// const LinesCharts = ({ data, title, xLabel, yLabel }) => {
const LinesCharts = (props) => {
  const data = [
    {
      "name": "01",
      "uv": 4000,
    },
    {
      "name": "02",
      "uv": 3000,
    },
    {
      "name": "03",
      "uv": 0,
    },
    {
      "name": "04",
      "uv": 2000,
    },
    {
      "name": "05",
      "uv": 2780,
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    // console.log('CustomTooltip', active, payload, label);
    const isVisible = active && payload && payload.length;
    return (
      <div className="custom-tooltip" style={{ visibility: isVisible ? 'visible' : 'hidden', background: 'white' }}>
        {isVisible && (
          <div style={{ padding: '5px' }}>
            {/* <p className="label">{`${label} : ${payload[0].value}`}</p>
            <p className="intro">{getIntroOfPage(label)}</p>
            <p className="desc">Anything you want can be displayed here.</p> */}
            当日总支出：{payload[0].value}
          </div>
        )}
      </div>
    );
  };
  return (
    <LineChart
      style={{ width: '100%', maxWidth: '700px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <XAxis dataKey="name" />
      {/* <YAxis width="auto" /> */}
      <Tooltip
        content={CustomTooltip}
      />
      {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
  );
};

export default LinesCharts;