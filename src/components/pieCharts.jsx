import React, { useState, useEffect } from 'react';
import { Cell, Pie, PieChart, PieLabelRenderProps } from 'recharts';

const pieCharts = (props) => {
  // const data = [
  //   {
  //     "name": "汽车",
  //     "color": "#0088FE",
  //     "value": 100
  //   },
  //   {
  //     "name": "生活",
  //     "color": "#00C49F",
  //     "value": 100
  //   },
  //   {
  //     "name": "零食",
  //     "color": "#FFBB28",
  //     "value": 100
  //   },
  //   {
  //     "name": "吃饭",
  //     "color": "#FF8042",
  //     "value": 700
  //   }
  // ]
  console.log(props.data);
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: PieLabelRenderProps) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
      return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} ${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <PieChart style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }} responsive>
      <Pie
        data={props.data}
        labelLine={false}
        label={renderCustomizedLabel}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={true}
      >
        {props.data.map((entry, index) => (
          <Cell key={`cell-${entry.name}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  );

};

export default pieCharts;