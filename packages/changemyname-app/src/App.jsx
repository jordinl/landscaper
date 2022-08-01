import React, { useEffect, useState } from "react";
import { Landscape } from "changemyname-base";
import { Slider } from "primereact/slider";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import landscapeUrl from "project/landscape.json?url";

function App() {
  const [data, setData] = useState();
  const [zoom, setZoom] = React.useState(100);

  useEffect(() => {
    fetch(landscapeUrl)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  // TODO: add filters to sidebar
  console.log(data && data.filters)

  return (
    data && (
      <div className="App">
        <div className="landscape">
          <Landscape categories={data.categories} header={data.header} zoom={zoom / 100} />
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
