import "./App.css";
import { Landscape } from "changemyname-base";
import { useEffect, useState } from "react";

function App() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/assets/data.json")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    categories && (
      <div className="App">
        <div className="sidebar"></div>
        <div className="landscape">
          <Landscape categories={categories} />
        </div>
      </div>
    )
  );
}

export default App;
