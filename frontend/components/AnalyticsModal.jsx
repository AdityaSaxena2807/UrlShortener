import { useEffect, useState } from "react";
import axios from "axios";
import PieChartView from "./PieChartView";
import TimeSeriesGraph from "./TimeSeriesGraph";
import ReferrerTable from "./ReferrerTable";

export default function AnalyticsModal({ code, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/analytics/${code}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, [code]);

  if (error) return <div className="analytics-modal">❌ Error: {error}</div>;
  if (!data) return <div className="analytics-modal">Loading analytics...</div>;

  return (
    <div className="analytics-modal">
      <div className="modal-header">
        <h3>📈 Analytics for <code>{code}</code></h3>
        <button onClick={onClose} className="close-button">✖</button>
      </div>
      <p><strong>Total Visits:</strong> {data.totalVisits}</p>
      <p><strong>Unique Visitors:</strong> {data.uniqueVisitors}</p>
      <div className="chart-wrapper">
        <PieChartView byDevice={data.byDevice} />
        <TimeSeriesGraph timeSeries={data.timeSeries} />
      </div>
      <ReferrerTable topReferrers={data.topReferrers} />
    </div>
  );
}
