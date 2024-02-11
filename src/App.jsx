import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Expenses from "./Expenses";
import ManageExpenses from "./ManageExpenses";

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
