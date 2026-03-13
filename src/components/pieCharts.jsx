import React from 'react';
import { Cell, Pie, PieChart, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getIconByType } from '../utils.js';

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
  // Recharts 默认支持将标签渲染在饼图外部，并带有指示线（labelLine）。
  // 这种方式不仅不会遮挡内部，也从根本上避免了多个小比例数据因为全部挤在内部而导致文字重叠。
  const renderExternalLabel = ({ name, percent, x, y, cx }) => {
    // 如果占比小于 4%，则不显示文字标签
    if (percent < 0.04) return null;
    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderLabelLine = (props) => {
    // 如果占比小于 4%，则连线也不渲染
    if (props.percent < 0.04) return null;

    // 否则根据 Recharts 提供的点位绘制出常规折线
    const { points, stroke } = props;
    if (!points || !points.length) return null;
    return <polyline points={points.map(p => `${p.x},${p.y}`).join(' ')} stroke={stroke || '#999'} fill="none" strokeWidth={1} />;
  };

  // 计算总金额
  const totalSum = props.data?.reduce((sum, item) => sum + (Number(item.value) || 0), 0) || 0;

  return (
    <div style={{ width: '100%', minHeight: '380px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={props.data}
            cx="50%"
            cy="50%"
            labelLine={renderLabelLine} // 开启外部连线并使用自定义渲染
            label={renderExternalLabel} // 使用外部标签渲染
            // 将外半径缩小（比如设为 60% 或者固定像素值），
            // 这样饼图外围就会留出足够的空间来展示连线和文字，避免文字溢出当前组件。
            outerRadius="60%"
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={true}
          >
            {props.data?.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={getIconByType(entry.name).color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>

      {/* 显示总计金额 */}
      <div style={{ marginTop: '10px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
        总计: ¥{totalSum.toFixed(2)}
      </div>
    </div>
  );
};

export default pieCharts;