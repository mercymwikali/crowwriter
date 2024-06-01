import React from 'react';
import { Line } from '@ant-design/charts';

const FinesLineChart = ({ finesData }) => {
  const config = {
    data: finesData,
    xField: 'date',
    yField: 'count',
    xAxis: { title: { text: 'Date' } },
    yAxis: { title: { text: 'Number of Fined Orders' } },
    tooltip: { formatter: (datum) => `Date: ${datum.date}\nNumber of Fined Orders: ${datum.count}` },
    legend: { position: 'top' },
    seriesField: 'series', // Add seriesField to differentiate lines
    color: ['#ff4d4f', '#1890ff'], // Set custom colors for the lines
  };

  return <Line {...config} />;
};

export default FinesLineChart;
