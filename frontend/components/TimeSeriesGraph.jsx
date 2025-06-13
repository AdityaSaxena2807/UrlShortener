import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function TimeSeriesGraph({ timeSeries }) {
  const data = Object.entries(timeSeries).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div>
      <h4>Visits Over Time</h4>
      <LineChart width={400} height={200} data={data}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
