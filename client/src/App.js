import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./login/login";
import SignIn from "./signin/signin";
import Verify from './verify/verify';
import Profile from './profile/profile';
import Identity from './identity/identity';
import RoleAndMode from './roleandmode/roleandmode';
import Gender from './gender/gender';
import Home from './home/home';
import CreateCommute from './createcommute/createcommute';
import LiftTakerHome from './lifttakerhome/lifttakerhome';
import FindLift from './findlift/findlift';
import CompatibleRiders from './compatibleriders/compatibleriders';
import LiftRequest from './liftrequest/liftrequest';
import ViewRequest from './viewRequest/viewrequest';
import ConfirmRequest from './confimrequest/confirmrequest'
import MatchRequest from './matchRequest/MatchConfirm'
import Trips from './Trips/trips';
import VerifyPassanger from './verifypassanger/VerifyPassenger'

// Wraps every page in a fade-in (see .page-fade in index.css) and starts each
// page at the top, like a normal page load.
function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="page-fade">
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/identity" element={<Identity />} />
        <Route path="/roleandmode" element={<RoleAndMode />} />
        <Route path="/gender" element={<Gender />} />
        <Route path="/home" element={<Home />} />
        <Route path="/createcommute" element={<CreateCommute />} />
        <Route path="/lifttakerhome" element={<LiftTakerHome />} />
        <Route path="/findlift" element={<FindLift />} />
        <Route path="/compatibleriders/:requestId" element={<CompatibleRiders />} />
        <Route path="/liftrequest" element={<LiftRequest />} />
        <Route path="/viewRequest/:requestId" element={<ViewRequest />} />
        <Route path="/confirmrequest/:requestId" element={<ConfirmRequest />} />
        <Route path="/matchrequest/:requestId" element={<MatchRequest />} />
        {/* Old links without a request id lead back to the list */}
        <Route path="/viewRequest" element={<Navigate to="/liftrequest" replace />} />
        <Route path="/confirmrequest" element={<Navigate to="/liftrequest" replace />} />
        <Route path="/matchrequest" element={<Navigate to="/liftrequest" replace />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/verifypassanger" element={<VerifyPassanger />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;