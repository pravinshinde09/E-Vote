import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const size = width * 0.7; 
const radius = size / 2;
const strokeWidth = 60; 


const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    `L ${x} ${y}`,
    'Z',
  ].join(' ');
};

const PieChart = ({ data }: { data: { value: number; color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let cumulativeValue = 0;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G rotation="-90" origin={`${radius}, ${radius}`}>
        {data.map((slice, index) => {
          const startAngle = (cumulativeValue / total) * 360;
          cumulativeValue += slice.value;
          const endAngle = (cumulativeValue / total) * 360;

          const path = describeArc(radius, radius, radius - strokeWidth / 2, startAngle, endAngle);

          return <Path key={index} d={path} fill={slice.color} />;
        })}
      </G>

      <Circle cx={radius} cy={radius} r={radius - strokeWidth} fill="white" />
    </Svg>
  );
};

export default PieChart;
