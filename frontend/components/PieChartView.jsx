import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function PieChartView({ byDevice }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  const data = Object.entries(byDevice).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div>
      <h4>Device Type</h4>
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx={100}
          cy={100}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
