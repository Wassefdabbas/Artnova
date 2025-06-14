import "./app.css";
import LeftBar from "./components/LeftBar/LeftBar"
import TopBar from "./components/TopBar/TopBar";
import Gallery from "./components/Gallery/Gallery";
const App = () => {
  return (
    <div className="app">
      <LeftBar />
      <div className="content">
        <TopBar />
        <Gallery />
      </div>
    </div>
  )
};

export default App;