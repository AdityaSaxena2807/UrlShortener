export default function ReferrerTable({ topReferrers }) {
  return (
    <div>
      <h4>Top Referrers</h4>
      <table border="1">
        <thead>
          <tr>
            <th>Referrer</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {topReferrers.map(([ref, count], i) => (
            <tr key={i}>
              <td>{ref || "Direct"}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
