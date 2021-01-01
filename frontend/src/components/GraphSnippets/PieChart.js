import React from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

const PieGraph = ({ data, colors }) => {
  return (
    <PieChart width={700} height={300}>
      <Pie dataKey="count" data={data} isAnimationActive={false} outerRadius={80} label>
        {data.map((voice, index) => (
          <Cell name={voice.name} key={voice.name} fill={colors[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="top" height={36} iconSize={30} iconType="circle" />
    </PieChart>
  );
};

export default PieGraph;
