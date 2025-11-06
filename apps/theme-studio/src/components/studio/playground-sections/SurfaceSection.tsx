"use client";

import {
  Paper,
  Stack,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Mail,
  Notifications,
  Search as SearchIcon,
} from "@mui/icons-material";

export function SurfaceSection(): JSX.Element {
  return (
    <>
      {/* App Bar */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          App Bar
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Basic App Bar
            </Typography>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  App Title
                </Typography>
                <Button color="inherit">Login</Button>
              </Toolbar>
            </AppBar>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              App Bar with Icons
            </Typography>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Photos
                </Typography>
                <IconButton size="large" color="inherit">
                  <SearchIcon />
                </IconButton>
                <IconButton size="large" color="inherit">
                  <Mail />
                </IconButton>
                <IconButton size="large" color="inherit">
                  <Notifications />
                </IconButton>
                <IconButton size="large" edge="end" color="inherit">
                  <AccountCircle />
                </IconButton>
              </Toolbar>
            </AppBar>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              App Bar Colors
            </Typography>
            <Stack spacing={2}>
              <AppBar position="static" color="primary">
                <Toolbar>
                  <Typography variant="h6">Primary</Typography>
                </Toolbar>
              </AppBar>
              <AppBar position="static" color="secondary">
                <Toolbar>
                  <Typography variant="h6">Secondary</Typography>
                </Toolbar>
              </AppBar>
              <AppBar position="static" color="default">
                <Toolbar>
                  <Typography variant="h6">Default</Typography>
                </Toolbar>
              </AppBar>
              <AppBar position="static" color="transparent">
                <Toolbar>
                  <Typography variant="h6">Transparent</Typography>
                </Toolbar>
              </AppBar>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Dense App Bar
            </Typography>
            <AppBar position="static">
              <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div">
                  Dense Toolbar
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>
        </Stack>
      </Paper>

      {/* Paper Variants */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Paper Variants
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Elevations
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Paper elevation={0} sx={{ p: 2, width: 100, textAlign: "center" }}>
                elevation=0
              </Paper>
              <Paper elevation={1} sx={{ p: 2, width: 100, textAlign: "center" }}>
                elevation=1
              </Paper>
              <Paper elevation={2} sx={{ p: 2, width: 100, textAlign: "center" }}>
                elevation=2
              </Paper>
              <Paper elevation={3} sx={{ p: 2, width: 100, textAlign: "center" }}>
                elevation=3
              </Paper>
              <Paper elevation={4} sx={{ p: 2, width: 100, textAlign: "center" }}>
                elevation=4
              </Paper>
              <Paper elevation={8} sx={{ p: 2, width: 100, textAlign: "center" }}>
                elevation=8
              </Paper>
              <Paper elevation={12} sx={{ p: 2, width: 100, textAlign: "center" }}>
                elevation=12
              </Paper>
              <Paper elevation={16} sx={{ p: 2, width: 100, textAlign: "center" }}>
                elevation=16
              </Paper>
              <Paper elevation={24} sx={{ p: 2, width: 100, textAlign: "center" }}>
                elevation=24
              </Paper>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Variants
            </Typography>
            <Stack spacing={2}>
              <Paper variant="elevation" sx={{ p: 2 }}>
                Elevation Variant (default)
              </Paper>
              <Paper variant="outlined" sx={{ p: 2 }}>
                Outlined Variant
              </Paper>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Corners
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Paper sx={{ p: 2, borderRadius: 0 }}>Square</Paper>
              <Paper sx={{ p: 2, borderRadius: 1 }}>Rounded 1</Paper>
              <Paper sx={{ p: 2, borderRadius: 2 }}>Rounded 2</Paper>
              <Paper sx={{ p: 2, borderRadius: 3 }}>Rounded 3</Paper>
              <Paper sx={{ p: 2, borderRadius: 4 }}>Rounded 4</Paper>
              <Paper sx={{ p: 2, borderRadius: "50%" }}>Circle</Paper>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Card Variants (already shown in DataDisplaySection but worth showing surfaces) */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Card as Surface
        </Typography>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Default Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cards are surfaces that display content and actions on a single topic.
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div">
                Outlined Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                An outlined card removes the default elevation shadow.
              </Typography>
            </CardContent>
          </Card>

          <Card raised>
            <CardContent>
              <Typography variant="h5" component="div">
                Raised Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A raised card has a higher elevation than the default.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Paper>
    </>
  );
}
