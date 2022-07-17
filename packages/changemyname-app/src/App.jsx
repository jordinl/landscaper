import React, { useEffect, useState } from "react";
import { Landscape } from "changemyname-base";
import { Sidebar } from 'primereact/sidebar';
import { Slider } from 'primereact/slider';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";

function App() {
  const [categories, setCategories] = useState();
  const [expanded, setExpanded] = React.useState(false);
  const [zoom, setZoom] = React.useState(100);

  useEffect(() => {
    fetch("/landscape.json")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    categories && (
      <div className="App">
        <div className="landscape">
          <Landscape categories={categories} zoom={zoom / 100} />
        </div>
        <div className="sidebar">
            <Slider
                min={100}
                max={400}
                step={10}
                value={zoom}
                onChange={e => setZoom(e.value)}
            />
        </div>
      </div>
    )
  );
}

export default App;
