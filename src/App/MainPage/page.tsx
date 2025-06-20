import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  LightbulbOutlined,
  CalendarToday,
  ChecklistRtl,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useThemeMode } from "../../contexts/ThemeContext";

const MainPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const featureCards = [
    {
      title: "Todo List",
      icon: (
        <ChecklistRtl
          sx={{ fontSize: 60, color: theme.palette.primary.main }}
        />
      ),
      description: "Organize tasks effectively",
      route: "/todos",
      color: mode === "dark" ? "#232526" : theme.palette.primary.light,
    },
    {
      title: "Notes",
      icon: (
        <LightbulbOutlined
          sx={{ fontSize: 60, color: theme.palette.secondary.main }}
        />
      ),
      description: "Capture important information",
      route: "/notes",
      color: mode === "dark" ? "#232526" : theme.palette.secondary.light,
    },
    {
      title: "Calendar",
      icon: (
        <CalendarToday
          sx={{ fontSize: 60, color: theme.palette.success.main }}
        />
      ),
      description: "Visualize your schedule and plan ahead",
      route: "/calendar",
      color: mode === "dark" ? "#232526" : theme.palette.success.light,
    },
  ];

  const cardVariants = {
    hover: {
      y: -10,
      boxShadow: theme.shadows[8],
      transition: { duration: 0.3 },
    },
    initial: {
      y: 0,
      boxShadow: theme.shadows[2],
    },
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: isMobile ? 2 : 4,
        background:
          mode === "dark"
            ? "linear-gradient(135deg, #232526 0%, #414345 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 6, mt: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: mode === "dark" ? "#fff" : theme.palette.text.primary,
            mb: 2,
          }}
        >
          Productivity Suite
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: mode === "dark" ? "#bdbdbd" : theme.palette.text.secondary,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Your all-in-one productivity solution to organize tasks, capture
          ideas, and manage time effectively.
        </Typography>
      </Box>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ flexGrow: 1, alignItems: "center" }}
      >
        {featureCards.map((card, index) => (
          <Grid key={card.title}>
            <motion.div
              initial="initial"
              whileHover="hover"
              variants={cardVariants}
            >
              <Paper
                elevation={2}
                sx={{
                  width: 350,
                  height: 270,
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: card.color,
                  backgroundImage:
                    mode === "dark"
                      ? "linear-gradient(rgba(45,47,49,0.95), rgba(45,47,49,0.95))"
                      : "linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7))",
                  color: mode === "dark" ? "#fff" : "#000",
                  transition: "all 0.3s ease",
                }}
                onClick={() => navigate(card.route)}
              >
                {card.icon}
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    mt: 3,
                    mb: 2,
                    fontWeight: 600,
                    color:
                      mode === "dark" ? "#fff" : theme.palette.text.primary,
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color:
                      mode === "dark"
                        ? "#bdbdbd"
                        : theme.palette.text.secondary,
                    mb: 3,
                  }}
                >
                  {card.description}
                </Typography>
                <Box
                  sx={{
                    mt: "auto",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        mode === "dark"
                          ? "#90caf9"
                          : theme.palette.primary.main,
                      fontWeight: 500,
                    }}
                  >
                    Get Started →
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MainPage;
