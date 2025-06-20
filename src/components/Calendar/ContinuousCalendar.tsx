import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  Dialog,
  DialogTitle,
  Snackbar,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useAuth } from "../../contexts/UseAuth";
import MuiAlert from "@mui/material/Alert";
import { useThemeMode } from "../../contexts/ThemeContext";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface CalendarEvent {
  id?: string;
  day: number;
  month: number;
  year: number;
  title: string;
}

interface ContinuousCalendarProps {
  onClick?: (_day: number, _month: number, _year: number) => void;
}

const ContinuousCalendar: React.FC<ContinuousCalendarProps> = ({ onClick }) => {
  const { mode } = useThemeMode();
  const today = useMemo(() => new Date(), []);
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [isUserSelectingMonth, setIsUserSelectingMonth] = useState(false);

  const [selectedDay, setSelectedDay] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [eventDetailOpen, setEventDetailOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const { addEvent, getEvents, deleteEvent } = useAuth();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch {}
    };
    fetchEvents();
  }, [getEvents]);

  const handleAddEvent = async () => {
    if (!selectedDay || !eventTitle.trim()) return;
    try {
      await addEvent({
        day: selectedDay.day,
        month: selectedDay.month,
        year: selectedDay.year,
        title: eventTitle.trim(),
      });
      setSnackbar({
        open: true,
        message: "Event added!",
        severity: "success",
      });
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Login first!",
        severity: "error",
      });
    }
    setEventDialogOpen(false);
    setEventTitle("");
    setSelectedDay(null);
  };

  const handleDeleteEvent = async (event: CalendarEvent) => {
    try {
      if (event.id) {
        await deleteEvent(event.id);
        setSnackbar({
          open: true,
          message: "Event deleted!",
          severity: "success",
        });
        const data = await getEvents();
        setEvents(data);
      }
      setActiveEvent(null);
      setEventDetailOpen(false);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to delete event!",
        severity: "error",
      });
    }
  };

  const scrollToDay = (monthIndex: number, dayIndex: number) => {
    const targetDayIndex = dayRefs.current.findIndex(
      (ref) =>
        ref &&
        ref.getAttribute("data-month") === `${monthIndex}` &&
        ref.getAttribute("data-day") === `${dayIndex}`
    );
    const targetElement = dayRefs.current[targetDayIndex];
    if (targetDayIndex !== -1 && targetElement) {
      const container = document.getElementById("calendar-container");
      const elementRect = targetElement.getBoundingClientRect();
      const offsetFactor = window.matchMedia("(min-width: 1536px)").matches
        ? 3
        : 2.5;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const offset =
          elementRect.top -
          containerRect.top -
          containerRect.height / offsetFactor +
          elementRect.height / 2;
        container.scrollTo({
          top: container.scrollTop + offset,
          behavior: "smooth",
        });
      }
    }
  };

  const handleMonthChange = (event: any) => {
    const monthIndex = parseInt(event.target.value, 10);
    setIsUserSelectingMonth(true);
    setSelectedMonth(monthIndex);
  };

  useEffect(() => {
    if (!isUserSelectingMonth) return;
    const firstDayIndex = dayRefs.current.findIndex(
      (ref) =>
        ref &&
        ref.getAttribute("data-month") === `${selectedMonth}` &&
        ref.getAttribute("data-day") === `1`
    );
    const targetElement = dayRefs.current[firstDayIndex];
    if (targetElement) {
      const container = document.getElementById("calendar-container");
      const elementRect = targetElement.getBoundingClientRect();
      const offsetFactor = window.matchMedia("(min-width: 1536px)").matches
        ? 3
        : 2.5;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const offset =
          elementRect.top -
          containerRect.top -
          containerRect.height / offsetFactor +
          elementRect.height / 2;
        container.scrollTo({
          top: container.scrollTop + offset,
          behavior: "smooth",
        });
      }
    }
    const timeout = setTimeout(() => setIsUserSelectingMonth(false), 500);
    return () => clearTimeout(timeout);
  }, [selectedMonth, isUserSelectingMonth]);

  const handleTodayClick = () => {
    setYear(today.getFullYear());
    scrollToDay(today.getMonth(), today.getDate());
  };

  const handleDayClick = React.useCallback(
    (day: number, month: number, year: number) => {
      if (month >= 0) {
        setSelectedDay({ day, month, year });
      } else {
        setSelectedDay(null);
      }
      if (onClick) {
        if (month < 0) {
          onClick(day, 11, year - 1);
        } else {
          onClick(day, month, year);
        }
      }
    },
    [onClick]
  );

  const generateCalendar = useMemo(() => {
    const daysInYear = (): { month: number; day: number }[] => {
      const days = [];
      const startDayOfWeek = new Date(year, 0, 1).getDay();
      if (startDayOfWeek < 6) {
        for (let i = 0; i < startDayOfWeek; i++) {
          days.push({ month: -1, day: 32 - startDayOfWeek + i });
        }
      }
      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          days.push({ month, day });
        }
      }
      const lastWeekDayCount = days.length % 7;
      if (lastWeekDayCount > 0) {
        const extraDaysNeeded = 7 - lastWeekDayCount;
        for (let day = 1; day <= extraDaysNeeded; day++) {
          days.push({ month: 0, day });
        }
      }
      return days;
    };

    const calendarDays = daysInYear();
    const calendarWeeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push(calendarDays.slice(i, i + 7));
    }

    return calendarWeeks.map((week, weekIndex) => (
      <Box key={`week-${weekIndex}`} display="flex" width="100%">
        {week.map(({ month, day }, dayIndex) => {
          const index = weekIndex * 7 + dayIndex;
          const isNewMonth =
            index === 0 || calendarDays[index - 1].month !== month;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
          const isSelected =
            selectedDay &&
            selectedDay.day === day &&
            selectedDay.month === month &&
            selectedDay.year === year;

          const dayEvents = events.filter(
            (e) => e.day === day && e.month === month && e.year === year
          );

          return (
            <Box
              key={`${month}-${day}`}
              ref={(el) => {
                dayRefs.current[index] = el as HTMLDivElement | null;
              }}
              data-month={month}
              data-day={day}
              onClick={() => {
                if (dayEvents.length > 0) {
                  setActiveEvent(dayEvents[0]);
                  setEventDetailOpen(true);
                } else {
                  handleDayClick(day, month, year);
                }
              }}
              sx={{
                position: "relative",
                aspectRatio: "1 / 1",
                width: "100%",
                flexGrow: 1,
                border: isSelected
                  ? `2px solid ${mode === "dark" ? "#90caf9" : "#1976d2"}`
                  : `1px solid ${mode === "dark" ? "#444" : "#ccc"}`,
                borderRadius: 2,
                cursor: month >= 0 ? "pointer" : "default",
                m: 0.5,
                transition:
                  "box-shadow 0.2s, border-color 0.2s, background 0.2s",
                background: isSelected
                  ? mode === "dark"
                    ? "#1e293b"
                    : "#e3f2fd"
                  : "transparent",
                "&:hover": {
                  boxShadow:
                    mode === "dark" ? "0 0 0 2px #90caf9" : "0 0 0 2px #90caf9",
                  borderColor: "#90caf9",
                  background: mode === "dark" ? "#232526" : "#e3f2fd",
                  zIndex: 2,
                },
                opacity: month < 0 ? 0.3 : 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: 6,
                  left: 6,
                  fontSize: 12,
                  fontWeight: isToday ? "bold" : "normal",
                  backgroundColor: isToday
                    ? mode === "dark"
                      ? "#1976d2"
                      : "blue"
                    : "transparent",
                  color: isToday
                    ? "#fff"
                    : month < 0
                    ? mode === "dark"
                      ? "#888"
                      : "gray"
                    : mode === "dark"
                    ? "#fff"
                    : "#000",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {day}
              </Typography>
              {isNewMonth && month >= 0 && (
                <Typography
                  variant="subtitle2"
                  sx={{
                    position: "absolute",
                    bottom: 4,
                    left: 8,
                    color: mode === "dark" ? "#bbb" : "#bbb",
                  }}
                >
                  {monthNames[month]}
                </Typography>
              )}
              {dayEvents.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pointerEvents: "none",
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: mode === "dark" ? "#1976d2" : "#1976d2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InfoIcon sx={{ color: "#fff", fontSize: 14 }} />
                  </Box>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    ));
  }, [year, today, selectedDay, events, handleDayClick, mode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserSelectingMonth) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const month = parseInt(
              entry.target.getAttribute("data-month") || "0",
              10
            );
            setSelectedMonth(month);
          }
        }
      },
      {
        root: document.getElementById("calendar-container"),
        rootMargin: "-75% 0px -25% 0px",
        threshold: 0,
      }
    );

    dayRefs.current.forEach((ref) => {
      if (ref?.getAttribute("data-day") === "15") {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [isUserSelectingMonth]);

  return (
    <Box
      id="calendar-container"
      sx={{
        maxHeight: "90vh",
        overflowY: "scroll",
        background: mode === "dark" ? "#232526" : "#f5f7fa",
        borderRadius: 3,
        boxShadow: 4,
        p: 0,
      }}
    >
      <Box
        position="sticky"
        top={0}
        zIndex={1}
        sx={{
          background: mode === "dark" ? "#232526" : "#f5f7fa",
          p: 2,
          borderBottom: `1px solid ${mode === "dark" ? "#444" : "#eee"}`,
          boxShadow: "none",
        }}
      >
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Select
            value={`${selectedMonth}`}
            onChange={handleMonthChange}
            size="small"
            sx={{
              background: mode === "dark" ? "#2d2f31" : "#fff",
              color: mode === "dark" ? "#fff" : "#000",
              borderRadius: 1,
            }}
          >
            {monthNames.map((month, index) => (
              <MenuItem key={index} value={`${index}`}>
                {month}
              </MenuItem>
            ))}
          </Select>
          <Button variant="outlined" size="small" onClick={handleTodayClick}>
            Today
          </Button>
          <Button
            type="button"
            disabled={!selectedDay}
            variant="contained"
            style={{
              opacity: !selectedDay ? 0.5 : 1,
              cursor: !selectedDay ? "not-allowed" : "pointer",
            }}
            onClick={() => setEventDialogOpen(true)}
          >
            + Add Event
          </Button>
        </Box>
      </Box>
      <Box mt={2}>{generateCalendar}</Box>
      <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)}>
        <DialogTitle
          sx={{
            background: mode === "dark" ? "#232526" : "#fff",
            color: mode === "dark" ? "#fff" : "#000",
          }}
        >
          Add Event
        </DialogTitle>
        <DialogContent
          sx={{
            background: mode === "dark" ? "#2d2f31" : "#fff",
            color: mode === "dark" ? "#fff" : "#000",
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            label="Event"
            fullWidth
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            sx={{
              input: { color: mode === "dark" ? "#fff" : "#000" },
              label: { color: mode === "dark" ? "#fff" : "#000" },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            background: mode === "dark" ? "#2d2f31" : "#fff",
          }}
        >
          <Button onClick={() => setEventDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddEvent}
            variant="contained"
            disabled={!eventTitle.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={eventDetailOpen} onClose={() => setEventDetailOpen(false)}>
        <DialogTitle
          sx={{
            background: mode === "dark" ? "#232526" : "#fff",
            color: mode === "dark" ? "#fff" : "#000",
          }}
        >
          Event Details
        </DialogTitle>
        <DialogContent
          sx={{
            background: mode === "dark" ? "#2d2f31" : "#fff",
            color: mode === "dark" ? "#fff" : "#000",
          }}
        >
          <Box
            sx={{
              width: 200,
              height: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: mode === "dark" ? "#35373a" : "#f5f5f5",
              borderRadius: 2,
              textAlign: "center",
              gap: 1,
              wordBreak: "break-word",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: "1rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {activeEvent?.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "0.85rem",
                textAlign: "center",
              }}
            >
              {activeEvent
                ? `${activeEvent.day} ${monthNames[activeEvent.month]} ${
                    activeEvent.year
                  }`
                : ""}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (activeEvent) handleDeleteEvent(activeEvent);
              }}
              sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
            >
              Delete Event
            </Button>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            background: mode === "dark" ? "#2d2f31" : "#fff",
          }}
        >
          <Button onClick={() => setEventDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            width: "100%",
            background: mode === "dark" ? "#232526" : undefined,
            color: mode === "dark" ? "#fff" : undefined,
          }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ContinuousCalendar;
