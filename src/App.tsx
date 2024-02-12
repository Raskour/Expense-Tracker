import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Expenses from "./screens/Expenses";
import ManageExpenses from "./screens/ManageExpenses";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Expenses />} />
        <Route path="/expenses/add" element={<ManageExpenses />} />
        <Route path="/expenses/edit" element={<ManageExpenses />} />
      </Routes>
    </Router>
  );
}

export default App;
