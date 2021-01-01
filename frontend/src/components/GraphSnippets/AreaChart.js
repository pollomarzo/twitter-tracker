import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Tooltip, Radar } from 'recharts';

const AreaChart = ({ data }) => {
  return (
    <RadarChart width={700} height={300} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <Tooltip />
      <Radar dataKey="count" stroke="#1da1f2" fill="#1da1f2" fillOpacity={0.6} />
    </RadarChart>
  );
};

export default AreaChart;
