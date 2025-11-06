"use client";

import {
  Alert,
  Paper,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Backdrop,
  Box,
} from "@mui/material";
import { useState } from "react";

export function FeedbackSection(): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);

  return (
    <>
      {/* Alerts */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Alerts
        </Typography>
        <Stack spacing={2}>
          <Alert severity="success">This is a success alert!</Alert>
          <Alert severity="info">This is an info alert!</Alert>
          <Alert severity="warning">This is a warning alert!</Alert>
          <Alert severity="error">This is an error alert!</Alert>
          <Alert severity="success" variant="outlined">
            Outlined success alert
          </Alert>
          <Alert severity="error" variant="filled">
            Filled error alert
          </Alert>
          <Alert severity="info" onClose={() => {}}>
            Alert with close button
          </Alert>
        </Stack>
      </Paper>

      {/* Dialog */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dialog
        </Typography>
        <Stack spacing={2}>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Open Dialog
          </Button>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This is a sample dialog component. It can contain any content
                you need, including forms, text, or other components.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={() => setDialogOpen(false)}
                variant="contained"
                autoFocus
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Paper>

      {/* Snackbar */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Snackbar
        </Typography>
        <Stack spacing={2}>
          <Button variant="contained" onClick={() => setSnackbarOpen(true)}>
            Show Snackbar
          </Button>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message="This is a snackbar message"
            action={
              <Button
                color="secondary"
                size="small"
                onClick={() => setSnackbarOpen(false)}
              >
                UNDO
              </Button>
            }
          />
        </Stack>
      </Paper>

      {/* Progress Indicators */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Progress Indicators
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Circular Progress
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress />
              <CircularProgress color="secondary" />
              <CircularProgress color="success" />
              <CircularProgress color="inherit" />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Circular Progress - Sizes
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress size={20} />
              <CircularProgress size={30} />
              <CircularProgress size={40} />
              <CircularProgress size={60} />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Circular Progress - Determinate
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress variant="determinate" value={25} />
              <CircularProgress variant="determinate" value={50} />
              <CircularProgress variant="determinate" value={75} />
              <CircularProgress variant="determinate" value={100} />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Linear Progress
            </Typography>
            <Stack spacing={2}>
              <LinearProgress />
              <LinearProgress color="secondary" />
              <LinearProgress color="success" />
              <LinearProgress color="inherit" />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Linear Progress - Determinate
            </Typography>
            <Stack spacing={2}>
              <LinearProgress variant="determinate" value={25} />
              <LinearProgress variant="determinate" value={50} />
              <LinearProgress variant="determinate" value={75} />
              <LinearProgress variant="determinate" value={100} />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Linear Progress - Buffer
            </Typography>
            <LinearProgress variant="buffer" value={60} valueBuffer={80} />
          </Box>
        </Stack>
      </Paper>

      {/* Skeleton */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Skeleton
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Text Variants
            </Typography>
            <Stack spacing={1}>
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
              <Skeleton variant="text" sx={{ fontSize: "3rem" }} width="60%" />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Shape Variants
            </Typography>
            <Stack spacing={2}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rectangular" width={210} height={60} />
              <Skeleton variant="rounded" width={210} height={60} />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Card Skeleton Example
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton variant="text" sx={{ fontSize: "0.875rem" }} width="60%" />
              </Box>
            </Box>
            <Skeleton variant="rectangular" width="100%" height={118} sx={{ mt: 1 }} />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Animations
            </Typography>
            <Stack spacing={1}>
              <Skeleton animation="pulse" />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
