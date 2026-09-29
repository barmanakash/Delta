import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./login/login";
import SignIn from "./signin/signin";
import Verify from './verify/verify';
import Profile from './profile/profile';
import Identity from './identity/identity';
import RoleAndMode from './roleandmode/roleandmode';
import Gender from './gender/gender';
import Home from './home/home';
import LiftRequest from './liftrequest/liftrequest';
import ViewRequest from './viewRequest/viewrequest';
import ConfirmRequest from './confimrequest/confirmrequest'
import MatchRequest from './matchRequest/MatchConfirm'
import Trips from './Trips/trips';
import VerifyPassanger from './verifypassanger/VerifyPassenger'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/identity" element={<Identity />} />
        <Route path="/roleandmode" element={<RoleAndMode />} />
        <Route path="/gender" element={<Gender />} />
        <Route path="/home" element={<Home />} />
        <Route path="/liftrequest" element={<LiftRequest />} />
        <Route path="/viewRequest" element={<ViewRequest />} />
        <Route path="/confirmrequest" element={<ConfirmRequest />} />
        <Route path="/matchrequest" element={<MatchRequest />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/verifypassanger" element={<VerifyPassanger />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;