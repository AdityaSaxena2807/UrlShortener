
#  Advanced URL Shortener with Analytics Dashboard

A full-stack MERN application to shorten URLs, track visits, analyze device usage, manage custom short codes, tag links, and visualize analytics with Recharts.

## Features

-  Shorten URLs (random or custom code)
-  Add tags and expiry date to links
-  Track visits, devices, referrers, and unique users
-  Visual analytics (Pie Chart, Time Series, Referrers Table)
-  Filterable, responsive dashboard with a dark theme

---

##  Tech Stack

- **Frontend:** React.js (Vite) + Recharts
- **Backend:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **Styling:** Custom dark theme CSS

---

##  How to Run Locally

###  Backend

```bash
cd backend
npm install
node server.js
````

> Requires MongoDB running on `mongodb://localhost:27017/urlShortener`

---

###  Frontend

```bash
cd frontend
npm install
npm run dev
```

> Visit the frontend at: [http://localhost:5173](http://localhost:5173)

---

## API Documentation

### POST `/api/shorten`

**Create a shortened URL**

**Request Body:**

```json
{
  "originalUrl": "https://example.com",
  "customCode": "mycustom",
  "tags": ["project", "blog"],
  "expiryDate": "2025-12-31T23:59:59.000Z"
}
```

**Response:**

```json
{
  "shortUrl": "http://localhost:5000/api/short/mycustom"
}
```

---

### GET `/api/short/:code`

Redirects to original URL
Also tracks:

* IP address
* Device type
* Referrer
* Visit timestamp
* Fingerprint for uniqueness

---

### GET `/api/analytics/:code`

Returns analytics for a short code.

**Response:**

```json
{
  "originalUrl": "https://example.com",
  "totalVisits": 12,
  "uniqueVisitors": 7,
  "byDevice": {
    "desktop": 8,
    "mobile": 4
  },
  "topReferrers": [["https://google.com", 3], ["https://twitter.com", 2]],
  "timeSeries": {
    "2025-06-12": 5,
    "2025-06-13": 7
  },
  "tags": ["project", "blog"]
}
```

---

### GET `/api/urls`

Returns all shortened URLs.

```json
[
  {
    "originalUrl": "https://example.com",
    "shortCode": "mycustom",
    "shortUrl": "http://localhost:5000/api/short/mycustom",
    "tags": ["blog"],
    "expiryDate": "2025-12-31T23:59:59.000Z"
  }
]
```

---

### GET `/api/tags/:tag`

Returns all short links tagged with a specific keyword.

```json
[
  {
    "shortCode": "mycustom",
    "originalUrl": "https://example.com",
    "visits": 12
  }
]
```

---

## Database Schema (ERD)

```
Url
├── originalUrl: String
├── shortCode: String (unique)
├── createdAt: Date (default: now)
├── expiryDate: Date (optional)
├── tags: [String]
├── visits: [Visit]

Visit
├── timestamp: Date
├── ip: String
├── deviceType: String (mobile/desktop/tablet)
├── referrer: String
├── fingerprint: String (SHA256 of IP + user-agent)
```
