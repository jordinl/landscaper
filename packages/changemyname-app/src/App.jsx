import React, { useEffect, useState } from "react";
import "./App.less";
import "virtual:Landscape.css";
import landscapeUrl from "project/assets/landscape.json?url";
import InteractiveLandscape from "./InteractiveLandscape.jsx";

const App = () => {
  const [landscape, setLandscape] = useState();

  useEffect(() => {
    fetch(landscapeUrl)
      .then((response) => response.json())
      .then((landscape) => setLandscape(landscape));
  }, []);

  return landscape ? <InteractiveLandscape landscape={landscape} /> : null;
};

export default App;
