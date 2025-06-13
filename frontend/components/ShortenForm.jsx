import { useState } from "react";
import axios from "axios";

function ShortenForm({ onNewLink }) {
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [tags, setTags] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/shorten", {
        originalUrl: longUrl,
        customCode: customCode || undefined,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        expiryDate: expiryDate || undefined,
      });

      if (res.status === 200) {
        setLongUrl("");
        setCustomCode("");
        setTags("");
        setExpiryDate("");
        onNewLink();
      }
    } catch (err) {
      setError("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Original URL</label>
      <input
        type="url"
        placeholder="https://example.com"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        required
      />
      <label>
        Custom Short Code <small>(optional)</small>
      </label>
      <input
        type="text"
        placeholder="e.g. mycustomcode"
        value={customCode}
        onChange={(e) => setCustomCode(e.target.value)}
      />

      <label>
        Tags <small>(comma-separated)</small>
      </label>
      <input
        type="text"
        placeholder="e.g. portfolio, blog, project"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <label>
        Expiry Date <small>(optional)</small>
      </label>
      <input
        type="datetime-local"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Shortening..." : "Shorten"}
      </button>

      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default ShortenForm;
