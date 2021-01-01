import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const BarChart = ({ data }) => {
  return (
    <AreaChart width={700} height={300} data={data}>
      <Area type="monotone" dataKey="count" stroke="#1da1f2" fill="#1da1f2" />
      <CartesianGrid strokeDasharray="1 1" />
      <XAxis dataKey="value" />
      <YAxis />
      <Tooltip />
    </AreaChart>
  );
};

export default BarChart;
