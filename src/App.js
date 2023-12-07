import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Form from "./Components/Form";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import FormsPage from "./Components/FormsPage.jsx";
import Response from "./Components/View/Response.jsx";
import Submitted from "./Components/Submitted.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/form/:formId?" element={<Form />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/response/:formId?" element={<Response />} />
          <Route path="/submitted" element={<Submitted />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
