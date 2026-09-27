import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#F4F5FF",
        borderTop: "1px dotted #1890FF",
        color: "#374151",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Main Footer */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1180px",
          mx: "auto",
          px: {
            xs: 3,
            sm: 4,
            md: 5,
          },
          pt: {
            xs: 5,
            md: 4,
          },
          pb: {
            xs: 4,
            md: 8,
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1.5fr 1fr 1fr",
              md: "1.8fr 1fr 1fr 1fr 1fr",
            },
            gap: {
              xs: 4,
              sm: 5,
              md: 4,
            },
          }}
        >
          {/* Brand */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 29,
                  height: 29,
                  borderRadius: "7px",
                  backgroundColor: "#12A89D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SecurityIcon
                  sx={{
                    fontSize: 19,
                    color: "#FFFFFF",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#202938",
                  lineHeight: 1,
                }}
              >
                Safe
                <Box
                  component="span"
                  sx={{
                    color: "#0FA89D",
                  }}
                >
                  Route
                </Box>
              </Typography>
            </Stack>

            <Typography
              sx={{
                maxWidth: "310px",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#4B5563",
              }}
            >
              Urban two-wheeler lift-sharing built on route matching
              and verified safety.
            </Typography>
          </Box>

          {/* Product */}
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#202938",
                mb: 1.5,
              }}
            >
              Product
            </Typography>

            <Stack spacing={1.2}>
              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                How It Works
              </Link>

              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Fare Estimator
              </Link>

              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Route Coverage
              </Link>
            </Stack>
          </Box>

          {/* Safety */}
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#202938",
                mb: 1.5,
              }}
            >
              Safety
            </Typography>

            <Stack spacing={1.2}>
              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Verification Model
              </Link>

              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Helmet & Ride
                <br />
                Standards
              </Link>

              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                24/7 SOS Protocol
              </Link>
            </Stack>
          </Box>

          {/* About */}
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#202938",
                mb: 1.5,
              }}
            >
              About
            </Typography>

            <Stack spacing={1.2}>
              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Company Story
              </Link>

              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Careers
              </Link>

              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Press & News
              </Link>
            </Stack>
          </Box>

          {/* Legal & Help */}
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#202938",
                mb: 1.5,
              }}
            >
              Legal & Help
            </Typography>

            <Stack spacing={1.2}>
              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Help Center
              </Link>

              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Privacy Policy
              </Link>

              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "14px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Terms of Service
              </Link>
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Bottom Footer */}
      <Box
        sx={{
          borderTop: "1px dotted #1890FF",
          px: {
            xs: 3,
            sm: 4,
            md: 5,
          },
          py: 1.5,
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: "1180px",
            mx: "auto",
            p: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: "#4B5563",
              }}
            >
              © 2025 SafeRoute Technologies Inc. All rights reserved.
            </Typography>

            <Stack
              direction="row"
              spacing={3}
            >
              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "12px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Privacy
              </Link>

              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "12px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Terms
              </Link>

              <Link
                href="#"
                underline="none"
                sx={{
                  fontSize: "12px",
                  color: "#4B5563",
                  "&:hover": {
                    color: "#0FA89D",
                  },
                }}
              >
                Security
              </Link>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Footer;