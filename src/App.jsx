import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CompanyProfile from "./components/CompanyProfile";
import Requests from "./components/Requests";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Header />
        <Dashboard />
        <CompanyProfile />
        <Requests />
      </main>
    </div>
  );
}

export default App;