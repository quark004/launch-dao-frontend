import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import randomColor from 'randomcolor';
import BN from 'bn.js'

const Data = ({ chartData }) => {
  ChartJS.register(ArcElement, Tooltip);
  const [data, setData] = useState(null);

  useEffect(() => {
    const colors = randomColor({
      format: 'rgba',
      count: chartData.length,
      alpha: 0.3,
    });
    const bgColors = colors.map((color) => {
      const rgb = color.substring(4).split(',');
      const colorString = `rgb${rgb[0]},${rgb[1]},${rgb[2]})`;
      return colorString;
    });
    const data = {
      labels: chartData.map((x) => x.name),
      datasets: [
        {
          label: '# of Votes',
          data: chartData.map((x) => x.value.toNumber()),
          backgroundColor: colors,
          borderColor: bgColors,
          borderWidth: 1,
        },
      ],
    };
    setData(data);
    // console.log(data);
  }, [chartData]);
  return (
    data && (
      <div className="data">
        <Pie data={data} />
      </div>
    )
  );
};

export default Data;
