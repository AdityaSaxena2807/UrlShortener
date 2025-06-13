import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticsModal from "./AnalyticsModal";

function UrlList({ refresh }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAnalyticsCode, setActiveAnalyticsCode] = useState(null);

  useEffect(() => {
    axios
      .get("/api/urls")
      .then((res) => setUrls(res.data))
      .catch((err) => console.error("Failed to fetch URLs", err))
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) return <p className="loading">Loading shortened URLs...</p>;

  return (
    <div className="url-list">
      <h2>Shortened URLs</h2>
      {urls.map((url, index) => (
        <div className="url-card" key={url.shortCode}>
          <p>
            <strong>{index + 1}. Short Code:</strong>{" "}
            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
              {url.shortCode}
            </a>
          </p>
          <p>
            <strong>Original:</strong> {url.originalUrl}
          </p>

          {/* ✅ Tag display */}
          {url.tags?.length > 0 && (
            <p>
              <strong>Tags:</strong>{" "}
              <span className="tags">
                {url.tags.map((tag, i) => (
                  <span key={i} className="tag-item">
                    #{tag}
                  </span>
                ))}
              </span>
            </p>
          )}

          <button
            className="analytics-button"
            onClick={() => setActiveAnalyticsCode(url.shortCode)}
          >
            📊 View Analytics
          </button>
        </div>
      ))}

      {activeAnalyticsCode && (
        <AnalyticsModal
          code={activeAnalyticsCode}
          onClose={() => setActiveAnalyticsCode(null)}
        />
      )}
    </div>
  );
}

export default UrlList;
