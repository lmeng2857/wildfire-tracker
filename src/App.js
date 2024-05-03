import "./App.css";
import { DataProvider } from "./components/DataContext";
import CreateMap from "./components/CreateMap";
import "../node_modules/ol/ol.css";

function App() {
  return (
    <div className="App">
      <DataProvider>
        <CreateMap></CreateMap>
      </DataProvider>
    </div>
  );
}

export default App;
