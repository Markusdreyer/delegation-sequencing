import React from "react";
import Highcharts from "highcharts";
import HighchartsSunburst from "highcharts/modules/sunburst";
import HighchartsReact from "highcharts-react-official";
HighchartsSunburst(Highcharts);

interface Props {
  data: any;
}

const Sunburst: React.FC<Props> = (props) => {
  const { data } = props;
  console.log(data);

  const options = {
    credits: {
      enabled: false,
    },
    title: {
      text: "Result",
    },
    series: [
      {
        allowDrillToNode: true,
        type: "sunburst",
        data: data,
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      constructorType={"chart"}
    />
  );
};

export default Sunburst;
