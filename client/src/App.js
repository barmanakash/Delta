import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./login/login";
import Verify from './verify/verify'
import Profile from './profile/profile'
import Identity from './identity/identity'
import RoleAndMode from './roleandmode/roleandmode'
import Gender from './gender/gender'
import Home from './home/home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/identity" element={<Identity />} />
        <Route path="/roleandmode" element={<RoleAndMode />} />
        <Route path="/gender" element={<Gender />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;