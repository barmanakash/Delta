import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7ff",
    color: "#182238",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },

  header: {
    height: "70px",
    background: "#ffffff",
    borderBottom: "1px solid #e9e9f3",
    display: "flex",
    alignItems: "center",
    padding: "0 28px",
    gap: "28px",
    boxSizing: "border-box",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    minWidth: "245px",
  },

  logoIcon: {
    width: "29px",
    height: "29px",
    borderRadius: "7px",
    background: "#079c91",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    fontWeight: 800,
  },

  logo: {
    fontSize: "17px",
    fontWeight: 800,
    color: "#182238",
  },

  logoRoute: {
    color: "#079c91",
  },

  ridePool: {
    fontSize: "9px",
    color: "#008477",
    fontWeight: 700,
    letterSpacing: ".3px",
    marginLeft: "-2px",
    marginTop: "19px",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: "36px",
    height: "100%",
  },

  navItem: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#263044",
    whiteSpace: "nowrap",
  },

  activeNav: {
    background: "#008579",
    color: "#fff",
    padding: "11px 18px",
    borderRadius: "8px",
  },

  requestBadge: {
    background: "#ffd9d7",
    color: "#d74b48",
    borderRadius: "50%",
    fontSize: "10px",
    minWidth: "19px",
    height: "19px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "5px",
  },

  headerRight: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  bell: {
    fontSize: "21px",
    position: "relative",
  },

  userPhoto: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #e9eef7 0%, #b9c7db 50%, #69758a 100%)",
    border: "2px solid #fff",
    boxShadow: "0 0 0 1px #e4e4ee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.1,
  },

  userName: {
    fontSize: "12px",
    fontWeight: 700,
  },

  userStatus: {
    fontSize: "9px",
    color: "#68717e",
    marginTop: "3px",
  },

  main: {
    padding: "12px 22px 0",
    boxSizing: "border-box",
  },

  topBar: {
    height: "94px",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #eeeeF6",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    gap: "18px",
    boxSizing: "border-box",
    marginBottom: "12px",
  },

  back: {
    color: "#087d75",
    fontWeight: 700,
    fontSize: "13px",
  },

  tripTag: {
    background: "#e9ebf9",
    padding: "5px 9px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#47506b",
  },

  topStatusArea: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  statusPill: {
    background: "#e0f8f4",
    color: "#007a70",
    borderRadius: "18px",
    padding: "9px 14px",
    fontSize: "11px",
    fontWeight: 700,
  },

  livePill: {
    background: "#eef0ff",
    color: "#414d9c",
    borderRadius: "18px",
    padding: "8px 13px",
    fontSize: "11px",
    fontWeight: 600,
  },

  pickupPill: {
    background: "#eef0ff",
    color: "#4b52a2",
    borderRadius: "18px",
    padding: "8px 13px",
    fontSize: "11px",
    fontWeight: 600,
  },

  content: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(360px, 1fr)",
    gap: "18px",
    alignItems: "stretch",
  },

  mapCard: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #eeeeF5",
    overflow: "hidden",
    minHeight: "675px",
    position: "relative",
  },

  fakeMap: {
    height: "580px",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #dff5e8 0%, #edf7e9 20%, #e9f3ed 35%, #dceef0 52%, #eff5e7 68%, #e6f3df 100%)",
  },

  road: {
    position: "absolute",
    borderRadius: "50%",
    border: "4px solid rgba(255,255,255,.9)",
    boxShadow: "0 0 0 2px rgba(159,173,189,.35)",
  },

  river: {
    position: "absolute",
    width: "120%",
    height: "105px",
    left: "-10%",
    top: "325px",
    transform: "rotate(-8deg)",
    background: "rgba(152,211,229,.4)",
    borderTop: "4px solid rgba(255,255,255,.6)",
    borderBottom: "4px solid rgba(255,255,255,.5)",
  },

  mapLabel: {
    position: "absolute",
    color: "#596873",
    fontWeight: 600,
    fontSize: "13px",
  },

  bigCity: {
    position: "absolute",
    left: "43%",
    top: "38%",
    fontSize: "29px",
    fontWeight: 600,
    color: "#283c43",
    opacity: ".9",
  },

  routeLine: {
    position: "absolute",
    left: "21%",
    top: "65%",
    width: "48%",
    height: "8px",
    background: "#00877b",
    transform: "rotate(-25deg)",
    transformOrigin: "left center",
    borderRadius: "10px",
    boxShadow: "0 0 0 2px rgba(255,255,255,.7)",
  },

  routeLine2: {
    position: "absolute",
    left: "48%",
    top: "48%",
    width: "28%",
    height: "8px",
    background: "#176e9a",
    transform: "rotate(-35deg)",
    transformOrigin: "left center",
    borderRadius: "10px",
    boxShadow: "0 0 0 2px rgba(255,255,255,.7)",
  },

  youMarker: {
    position: "absolute",
    left: "20%",
    top: "72%",
    width: "43px",
    height: "43px",
    borderRadius: "50%",
    background: "#087d75",
    border: "5px solid #fff",
    boxShadow: "0 2px 10px rgba(0,0,0,.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "21px",
    zIndex: 4,
  },

  destinationMarker: {
    position: "absolute",
    left: "72%",
    top: "34%",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#fff",
    border: "5px solid #087d75",
    boxShadow: "0 2px 8px rgba(0,0,0,.15)",
    zIndex: 4,
  },

  hospitalMarker: {
    position: "absolute",
    left: "45%",
    top: "29%",
    background: "#fff",
    borderRadius: "20px",
    padding: "8px 14px",
    boxShadow: "0 3px 12px rgba(0,0,0,.14)",
    fontSize: "11px",
    fontWeight: 700,
    color: "#21333b",
    zIndex: 5,
  },

  maneuver: {
    position: "absolute",
    left: "18px",
    top: "27px",
    width: "250px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 22px rgba(23,35,53,.18)",
    padding: "18px",
    zIndex: 8,
    boxSizing: "border-box",
  },

  maneuverIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "9px",
    background: "#087d75",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    float: "left",
    marginRight: "13px",
  },

  maneuverSmall: {
    fontSize: "10px",
    color: "#007e74",
    fontWeight: 700,
    marginBottom: "3px",
  },

  maneuverTitle: {
    fontSize: "16px",
    fontWeight: 800,
    marginBottom: "7px",
  },

  maneuverText: {
    clear: "both",
    paddingTop: "10px",
    fontSize: "11px",
    color: "#53606a",
    lineHeight: 1.45,
  },

  maneuverStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    marginTop: "12px",
    paddingTop: "11px",
    borderTop: "1px solid #edf0f3",
    gap: "8px",
  },

  statValue: {
    fontSize: "14px",
    fontWeight: 800,
    color: "#192438",
  },

  statLabel: {
    fontSize: "9px",
    color: "#727b85",
    marginBottom: "3px",
  },

  mapBottom: {
    position: "absolute",
    bottom: "15px",
    left: "18px",
    display: "flex",
    gap: "8px",
    zIndex: 6,
  },

  mapBadge: {
    background: "#fff",
    padding: "9px 13px",
    borderRadius: "18px",
    boxShadow: "0 2px 8px rgba(0,0,0,.12)",
    fontSize: "10px",
    fontWeight: 700,
    color: "#13776e",
  },

  routeProtocol: {
    height: "75px",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    padding: "0 18px",
    borderTop: "1px solid #eeeeF4",
    gap: "12px",
  },

  protocolIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#eff2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#087d75",
  },

  protocolText: {
    flex: 1,
  },

  protocolSmall: {
    fontSize: "10px",
    color: "#65717b",
  },

  protocolTitle: {
    fontSize: "14px",
    fontWeight: 800,
    marginTop: "3px",
  },

  deviation: {
    background: "#eceefe",
    padding: "6px 9px",
    borderRadius: "5px",
    fontSize: "10px",
    color: "#4b568a",
  },

  inspect: {
    color: "#007b71",
    fontSize: "11px",
    fontWeight: 700,
  },

  sidebar: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #eeeeF5",
    padding: "18px",
    boxSizing: "border-box",
    minHeight: "750px",
  },

  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  sideTitle: {
    fontSize: "21px",
    fontWeight: 800,
    marginBottom: "5px",
  },

  eta: {
    background: "#e7f8f5",
    color: "#087c72",
    borderRadius: "16px",
    padding: "8px 11px",
    fontSize: "10px",
    fontWeight: 700,
  },

  passengerCard: {
    background: "#f0f0ff",
    borderRadius: "11px",
    padding: "14px",
    marginTop: "14px",
  },

  passengerHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  passengerPhoto: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#e8edf5,#c4d2df 50%,#788798)",
    border: "3px solid #fff",
    boxShadow: "0 0 0 1px #008579",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  passengerName: {
    fontSize: "17px",
    fontWeight: 800,
  },

  verified: {
    fontSize: "10px",
    color: "#5260a7",
    marginTop: "3px",
  },

  male: {
    marginLeft: "auto",
    color: "#4649d6",
    background: "#fff",
    borderRadius: "15px",
    padding: "5px 8px",
    fontSize: "9px",
    fontWeight: 700,
  },

  detailBox: {
    background: "#fff",
    borderRadius: "9px",
    marginTop: "12px",
    padding: "11px",
  },

  detailRow: {
    display: "flex",
    gap: "9px",
    marginBottom: "11px",
  },

  detailIcon: {
    width: "21px",
    color: "#00877b",
    fontSize: "15px",
  },

  detailLabel: {
    fontSize: "9px",
    color: "#69737b",
    fontWeight: 600,
  },

  detailValue: {
    fontSize: "12px",
    fontWeight: 800,
    color: "#1c2638",
    marginTop: "2px",
  },

  confirmed: {
    marginLeft: "auto",
    alignSelf: "center",
    background: "#dff7f1",
    color: "#008176",
    padding: "6px 9px",
    borderRadius: "15px",
    fontSize: "9px",
    fontWeight: 800,
  },

  privacy: {
    marginTop: "8px",
    background: "#e5e8fa",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "10px",
    color: "#394253",
    lineHeight: 1.35,
  },

  progressionTitle: {
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: ".5px",
    color: "#69737a",
    marginTop: "19px",
    marginBottom: "9px",
  },

  step: {
    position: "relative",
    display: "flex",
    gap: "12px",
    minHeight: "64px",
  },

  stepCircle: {
    width: "28px",
    height: "28px",
    minWidth: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e8ebef",
    color: "#87909a",
    fontSize: "13px",
    zIndex: 2,
  },

  completedCircle: {
    background: "#00877b",
    color: "#fff",
  },

  activeCircle: {
    background: "#00877b",
    color: "#fff",
    boxShadow: "0 0 0 7px #d9f2ee",
  },

  stepLine: {
    position: "absolute",
    left: "13px",
    top: "28px",
    width: "2px",
    height: "50px",
    background: "#d7dde3",
  },

  stepContent: {
    paddingTop: "1px",
  },

  stepName: {
    fontSize: "12px",
    fontWeight: 800,
  },

  stepDescription: {
    fontSize: "10px",
    color: "#737c83",
    marginTop: "3px",
  },

  activeStep: {
    background: "#e2f3f0",
    borderRadius: "9px",
    padding: "9px",
    marginLeft: "-9px",
    marginRight: "-9px",
  },

  activeTag: {
    marginLeft: "auto",
    color: "#00786f",
    fontSize: "9px",
    fontWeight: 800,
    alignSelf: "center",
  },

  safetyBox: {
    background: "#e8ebff",
    borderRadius: "11px",
    padding: "14px",
    marginTop: "4px",
    fontSize: "10px",
    lineHeight: 1.45,
    color: "#454d62",
  },

  safetyTitle: {
    fontSize: "12px",
    fontWeight: 800,
    color: "#26324b",
    marginBottom: "6px",
  },

  pickupButton: {
    width: "100%",
    height: "47px",
    border: "none",
    borderRadius: "9px",
    background: "#008277",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 800,
    marginTop: "18px",
    cursor: "pointer",
  },

  sidebarBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "14px",
    padding: "0 28px",
    fontSize: "10px",
    fontWeight: 700,
  },

  tripDetails: {
    color: "#4f565e",
  },

  sos: {
    color: "#dd3939",
  },

  footer: {
    minHeight: "53px",
    marginTop: "14px",
    background: "#f0f1ff",
    borderTop: "1px solid #e4e5ef",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    fontSize: "10px",
    color: "#59616a",
    boxSizing: "border-box",
  },

  footerLeft: {
    display: "flex",
    gap: "23px",
  },

  footerItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  footerGreen: {
    color: "#007d73",
  },

  footerBlue: {
    color: "#4c54bf",
  },

  footerRed: {
    color: "#dd3737",
  },

  footerRight: {
    marginLeft: "auto",
  },
};

function Home() {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logoBox}>
          <div style={styles.logoIcon}>✓</div>

          <div style={styles.logo}>
            Safe<span style={styles.logoRoute}>Route</span>
          </div>

          <div style={{ fontSize: "17px", fontWeight: 800 }}>
            SafeRoute
          </div>

          <div style={styles.ridePool}>RIDE-POOL</div>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navItem}>Home</div>
          <div style={styles.navItem}>My Route</div>

          <div style={{ ...styles.navItem, ...styles.activeNav }}>
            Requests
            <span style={styles.requestBadge}>3</span>
          </div>

          <div style={styles.navItem}>Trips</div>
        </nav>

        <div style={styles.headerRight}>
          <div style={styles.bell}>♧</div>

          <div style={styles.userPhoto}>👨🏻</div>

          <div style={styles.userInfo}>
            <div style={styles.userName}>Harshit Bhargava</div>
            <div style={styles.userStatus}>✓ Verified Daily Pooler</div>
          </div>

          <div style={{ fontSize: "14px" }}>⌄</div>
        </div>
      </header>

      <main style={styles.main}>
        {/* TOP STATUS */}
        <div style={styles.topBar}>
          <div style={styles.back}>← Back to Trips</div>

          <div style={{ color: "#b4bac4" }}>/</div>

          <div style={styles.tripTag}>#TRIP-8421</div>

          <div style={styles.topStatusArea}>
            <div style={styles.livePill}>
              ◉ Live AIS-140 Corridor Tracking (±3m accuracy)
            </div>

            <div style={styles.pickupPill}>
              ◷ Pickup Window: 08:25 AM – 08:35 AM (Scheduled 08:30 AM)
            </div>

            <div style={styles.statusPill}>
              ● Pickup Scheduled • En Route to Napier Town
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={styles.content}>
          {/* LEFT MAP */}
          <section style={styles.mapCard}>
            <div style={styles.fakeMap}>
              {/* Map roads */}
              <div
                style={{
                  ...styles.road,
                  width: "700px",
                  height: "220px",
                  left: "50px",
                  top: "90px",
                  transform: "rotate(18deg)",
                }}
              />

              <div
                style={{
                  ...styles.road,
                  width: "550px",
                  height: "170px",
                  left: "220px",
                  top: "270px",
                  transform: "rotate(-17deg)",
                }}
              />

              <div style={styles.river} />

              {/* Map labels */}
              <div
                style={{
                  ...styles.mapLabel,
                  left: "42%",
                  top: "25%",
                }}
              >
                Suhagi
              </div>

              <div
                style={{
                  ...styles.mapLabel,
                  left: "68%",
                  top: "24%",
                }}
              >
                Bilpur
              </div>

              <div style={styles.bigCity}>Jabalpur</div>

              <div
                style={{
                  ...styles.mapLabel,
                  left: "44%",
                  top: "61%",
                }}
              >
                Gwarighat
              </div>

              <div
                style={{
                  ...styles.mapLabel,
                  left: "76%",
                  top: "68%",
                }}
              >
                Salaiwada
              </div>

              <div
                style={{
                  ...styles.mapLabel,
                  left: "55%",
                  top: "76%",
                }}
              >
                Padariya
              </div>

              {/* Route */}
              <div style={styles.routeLine} />
              <div style={styles.routeLine2} />

              {/* Hospital */}
              <div style={styles.hospitalMarker}>
                ✚ &nbsp; City Hospital Gate 1 Bay
                <div
                  style={{
                    fontSize: "9px",
                    color: "#008277",
                    marginTop: "2px",
                  }}
                >
                  Napier Town Safe Hub
                </div>
              </div>

              {/* You */}
              <div style={styles.youMarker}>➤</div>

              {/* Destination */}
              <div style={styles.destinationMarker} />

              {/* Maneuver card */}
              <div style={styles.maneuver}>
                <div style={styles.maneuverIcon}>↱</div>

                <div style={styles.maneuverSmall}>NEXT MANEUVER · In 400m</div>

                <div style={styles.maneuverTitle}>
                  Head to Napier Town
                </div>

                <div style={styles.maneuverText}>
                  Turn right onto Civic Center Main Road via City Hospital
                  Gate
                  <br />
                  1 Designated Bay.
                </div>

                <div style={styles.maneuverStats}>
                  <div>
                    <div style={styles.statLabel}>Distance</div>
                    <div style={styles.statValue}>1.4 km</div>
                  </div>

                  <div>
                    <div style={styles.statLabel}>Est. Arrival</div>
                    <div style={{ ...styles.statValue, color: "#008277" }}>
                      8:27 AM
                    </div>
                  </div>

                  <div>
                    <div style={styles.statLabel}>Condition</div>
                    <div
                      style={{
                        ...styles.statValue,
                        fontSize: "11px",
                        color: "#008277",
                      }}
                    >
                      ● Smooth
                    </div>
                  </div>
                </div>
              </div>

              {/* Map bottom badges */}
              <div style={styles.mapBottom}>
                <div style={styles.mapBadge}>
                  ✓ Corridor Safe Zone • 200m buffer active
                </div>

                <div style={styles.mapBadge}>⌁ Heading: NNE 28°</div>
              </div>
            </div>

            {/* Route Protocol */}
            <div style={styles.routeProtocol}>
              <div style={styles.protocolIcon}>⌁</div>

              <div style={styles.protocolText}>
                <div style={styles.protocolSmall}>
                  Designated Route Protocol
                </div>

                <div style={styles.protocolTitle}>
                  Civic Center Arterial → Napier Town Hospital Bay
                </div>
              </div>

              <div style={styles.deviation}>Max Deviation: 150m</div>

              <div style={styles.inspect}>Inspect Path⌄</div>
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <div>
                <div style={styles.sideTitle}>Pickup Passenger</div>
              </div>

              <div style={styles.eta}>◷ ~3 MINS</div>
            </div>

            {/* Passenger */}
            <div style={styles.passengerCard}>
              <div style={styles.passengerHeader}>
                <div style={styles.passengerPhoto}>👨🏻</div>

                <div>
                  <div style={styles.passengerName}>
                    Rohit ✓
                  </div>

                  <div style={styles.verified}>
                    Verified Commuter
                  </div>

                  <div
                    style={{
                      color: "#c48a20",
                      fontSize: "10px",
                      marginTop: "4px",
                    }}
                  >
                    ★ 4.9 (38 verified rides)
                  </div>
                </div>

                <div style={styles.male}>♂ Same-Gender</div>
              </div>

              <div style={styles.detailBox}>
                <div style={styles.detailRow}>
                  <div style={styles.detailIcon}>⌖</div>

                  <div>
                    <div style={styles.detailLabel}>
                      Designated Pickup Point
                    </div>

                    <div style={styles.detailValue}>Napier Town</div>

                    <div
                      style={{
                        fontSize: "9px",
                        color: "#008277",
                        fontWeight: 700,
                        marginTop: "3px",
                      }}
                    >
                      City Hospital Gate 1 • SafeRoute Designated Bay
                    </div>
                  </div>
                </div>

                <div style={styles.detailRow}>
                  <div style={styles.detailIcon}>◷</div>

                  <div>
                    <div style={styles.detailLabel}>Scheduled Slot</div>

                    <div style={styles.detailValue}>
                      08:30 AM (in ~3 mins)
                    </div>
                  </div>

                  <div style={styles.confirmed}>✓ Confirmed</div>
                </div>

                <div style={styles.detailRow}>
                  <div style={styles.detailIcon}>◱</div>

                  <div>
                    <div style={styles.detailLabel}>
                      Luggage & Safety Gear
                    </div>

                    <div style={styles.detailValue}>
                      1 Laptop Backpack • Passenger carrying ISI-approved
                      helmet
                    </div>
                  </div>
                </div>

                <div style={styles.privacy}>
                  🔒 <b>Strict Privacy Compliance:</b> Passenger phone
                  number and private contact details remain securely masked
                  for commuter protection.
                </div>
              </div>
            </div>

            {/* Trip Progression */}
            <div style={styles.progressionTitle}>TRIP PROGRESSION</div>

            <div style={styles.step}>
              <div
                style={{
                  ...styles.stepCircle,
                  ...styles.completedCircle,
                }}
              >
                ✓
              </div>

              <div style={styles.stepContent}>
                <div style={styles.stepName}>Match Confirmed</div>

                <div style={styles.stepDescription}>
                  Co-rider match verified & route locked
                </div>
              </div>

              <div style={styles.activeTag}>Completed</div>

              <div style={styles.stepLine} />
            </div>

            <div style={{ ...styles.step, ...styles.activeStep }}>
              <div
                style={{
                  ...styles.stepCircle,
                  ...styles.activeCircle,
                }}
              >
                ●
              </div>

              <div style={styles.stepContent}>
                <div style={styles.stepName}>Going to Pickup</div>

                <div style={styles.stepDescription}>
                  En route • Approaching Napier Town Bay
                </div>
              </div>

              <div style={styles.activeTag}>ACTIVE</div>

              <div style={styles.stepLine} />
            </div>

            <div style={styles.step}>
              <div style={styles.stepCircle}>♙</div>

              <div style={styles.stepContent}>
                <div style={styles.stepName}>Passenger Verification</div>

                <div style={styles.stepDescription}>
                  Unlocks upon reaching geofenced bay
                </div>
              </div>

              <div
                style={{
                  marginLeft: "auto",
                  fontSize: "9px",
                  color: "#7d858c",
                  alignSelf: "center",
                }}
              >
                Step 3
              </div>

              <div style={styles.stepLine} />
            </div>

            <div style={styles.step}>
              <div style={styles.stepCircle}>♧</div>

              <div style={styles.stepContent}>
                <div style={styles.stepName}>Shared Trip</div>

                <div style={styles.stepDescription}>
                  Madan Mahal Station corridor travel
                </div>
              </div>

              <div
                style={{
                  marginLeft: "auto",
                  fontSize: "9px",
                  color: "#7d858c",
                  alignSelf: "center",
                }}
              >
                Step 4
              </div>
            </div>

            {/* Safety */}
            <div style={styles.safetyBox}>
              <div style={styles.safetyTitle}>
                🛡️ &nbsp; Corridor Safety Standby Active
              </div>

              Meet only at the confirmed pickup location inside the
              geofenced safe bay.
              <br />
              <br />
              Use SafeRoute verification before starting the shared trip.
              <br />
              <br />
              24/7 MoRTH AIS-140 emergency dispatch actively monitoring this
              leg.
            </div>

            <button 
            onClick={() => navigate('/verifypassanger')}
            style={styles.pickupButton}>
              ⌖ &nbsp; I'm at Pickup
            </button>

            <div style={styles.sidebarBottom}>
              <div style={styles.tripDetails}>ⓘ View Trip Details</div>
              <div style={styles.sos}>◈ Emergency SOS</div>
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerLeft}>
          <div style={{ ...styles.footerItem, ...styles.footerGreen }}>
            🛡 AIS-140 & MoRTH Compliant
          </div>

          <div style={{ ...styles.footerItem, ...styles.footerBlue }}>
            ◈ ISO 27001 Certified Security
          </div>

          <div style={{ ...styles.footerItem, ...styles.footerRed }}>
            ⛑ 24/7 Police SOS Standby
          </div>
        </div>

        <div style={styles.footerRight}>
          © 2025 SafeRoute Technologies Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;