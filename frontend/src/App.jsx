import { useState } from 'react';
import ShortenForm from '../components/ShortenForm';
import UrlList from '../components/UrlList';
import "./App.css";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1>URL Shortener Dashboard</h1>
      <ShortenForm onNewLink={() => setRefresh(!refresh)} />
      <UrlList refresh={refresh} />
    </div>
  );
}

export default App;
