import {Routes,Route, BrowserRouter} from "react-router-dom";

import Home from "./pages/Home";
import News from "./pages/News";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Airquality from "./pages/Airquality";
import Register from "./pages/Register";
import Weather from "./pages/Weather";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import Maps from "./pages/Maps";



import Navbar from "./components/Navbar";

function App(){

  return(
    <BrowserRouter>

    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notfound" element={<NotFound />} />
      <Route path="/airquality" element={<Airquality />} />
      <Route path="/news" element={<News />} />
      <Route path="/maps" element={<Maps />} />
    </Routes>
    <Footer />

    </BrowserRouter>
  );
}

export default App;