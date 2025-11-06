"use client";

import {
  Paper,
  Stack,
  Typography,
  Tabs,
  Tab,
  Box,
  Breadcrumbs,
  Link,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  BottomNavigation,
  BottomNavigationAction,
  Stepper,
  Step,
  StepLabel,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from "@mui/material";
import {
  Home as HomeIcon,
  NavigateNext,
  ExpandMore,
  Restore,
  Favorite,
  LocationOn,
  Inbox,
  Mail,
  FileCopy,
  Save,
  Print,
  Share,
  Edit,
} from "@mui/icons-material";
import { useState } from "react";

export function NavigationSection(): JSX.Element {
  const [tabValue, setTabValue] = useState(0);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: "top" | "left" | "bottom" | "right", open: boolean) => {
    setDrawerOpen({ ...drawerOpen, [anchor]: open });
  };

  const drawerList = (anchor: "top" | "left" | "bottom" | "right") => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={() => toggleDrawer(anchor, false)}
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <Inbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <Inbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Tabs */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tabs
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Basic Tabs
            </Typography>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Item One" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && <Typography>Content for Tab One</Typography>}
              {tabValue === 1 && <Typography>Content for Tab Two</Typography>}
              {tabValue === 2 && <Typography>Content for Tab Three</Typography>}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Colored Tabs
            </Typography>
            <Tabs value={0} textColor="secondary" indicatorColor="secondary">
              <Tab label="Active" />
              <Tab label="Disabled" disabled />
              <Tab label="Active" />
            </Tabs>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Scrollable Tabs
            </Typography>
            <Tabs value={0} variant="scrollable" scrollButtons="auto">
              <Tab label="Item One" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
              <Tab label="Item Four" />
              <Tab label="Item Five" />
              <Tab label="Item Six" />
              <Tab label="Item Seven" />
            </Tabs>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Vertical Tabs
            </Typography>
            <Box sx={{ display: "flex", height: 200 }}>
              <Tabs
                orientation="vertical"
                value={0}
                sx={{ borderRight: 1, borderColor: "divider" }}
              >
                <Tab label="Item One" />
                <Tab label="Item Two" />
                <Tab label="Item Three" />
              </Tabs>
              <Box sx={{ p: 3, flex: 1 }}>
                <Typography>Vertical tab content</Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Breadcrumbs */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Breadcrumbs
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Basic Breadcrumbs
            </Typography>
            <Breadcrumbs>
              <Link underline="hover" color="inherit" href="#">
                Home
              </Link>
              <Link underline="hover" color="inherit" href="#">
                Category
              </Link>
              <Typography color="text.primary">Current Page</Typography>
            </Breadcrumbs>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              With Icons
            </Typography>
            <Breadcrumbs>
              <Link
                underline="hover"
                color="inherit"
                href="#"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                Home
              </Link>
              <Link underline="hover" color="inherit" href="#">
                Products
              </Link>
              <Typography color="text.primary">Details</Typography>
            </Breadcrumbs>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Custom Separator
            </Typography>
            <Breadcrumbs separator="›">
              <Link underline="hover" color="inherit" href="#">
                Home
              </Link>
              <Link underline="hover" color="inherit" href="#">
                Library
              </Link>
              <Typography color="text.primary">Data</Typography>
            </Breadcrumbs>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              With Icon Separator
            </Typography>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
              <Link underline="hover" color="inherit" href="#">
                Home
              </Link>
              <Link underline="hover" color="inherit" href="#">
                Settings
              </Link>
              <Typography color="text.primary">Profile</Typography>
            </Breadcrumbs>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Collapsed Breadcrumbs
            </Typography>
            <Breadcrumbs maxItems={2}>
              <Link underline="hover" color="inherit" href="#">
                Home
              </Link>
              <Link underline="hover" color="inherit" href="#">
                Level 1
              </Link>
              <Link underline="hover" color="inherit" href="#">
                Level 2
              </Link>
              <Link underline="hover" color="inherit" href="#">
                Level 3
              </Link>
              <Typography color="text.primary">Current</Typography>
            </Breadcrumbs>
          </Box>
        </Stack>
      </Paper>

      {/* Pagination */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Pagination
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Basic Pagination
            </Typography>
            <Pagination count={10} />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Variants
            </Typography>
            <Stack spacing={2}>
              <Pagination count={10} variant="outlined" />
              <Pagination count={10} variant="text" />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Colors
            </Typography>
            <Stack spacing={2}>
              <Pagination count={10} color="primary" />
              <Pagination count={10} color="secondary" />
              <Pagination count={10} color="standard" />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Sizes
            </Typography>
            <Stack spacing={2}>
              <Pagination count={10} size="small" />
              <Pagination count={10} size="medium" />
              <Pagination count={10} size="large" />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Shapes
            </Typography>
            <Stack spacing={2}>
              <Pagination count={10} shape="rounded" />
              <Pagination count={10} shape="circular" />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Show First/Last Buttons
            </Typography>
            <Pagination count={10} showFirstButton showLastButton />
          </Box>
        </Stack>
      </Paper>

      {/* Accordion */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Accordion
        </Typography>
        <Stack spacing={2}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Accordion 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                This is the content of the first accordion. It can contain any
                type of content you need.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Accordion 2</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                This is the content of the second accordion with more detailed
                information.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion disabled>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Disabled Accordion</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>This accordion is disabled.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Expanded by Default</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>This accordion is expanded by default.</Typography>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Paper>

      {/* Bottom Navigation */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Bottom Navigation
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Basic Bottom Navigation
            </Typography>
            <BottomNavigation
              showLabels
              value={bottomNavValue}
              onChange={(_, newValue) => setBottomNavValue(newValue)}
            >
              <BottomNavigationAction label="Recents" icon={<Restore />} />
              <BottomNavigationAction label="Favorites" icon={<Favorite />} />
              <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
            </BottomNavigation>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Without Labels
            </Typography>
            <BottomNavigation value={0}>
              <BottomNavigationAction icon={<Restore />} />
              <BottomNavigationAction icon={<Favorite />} />
              <BottomNavigationAction icon={<LocationOn />} />
            </BottomNavigation>
          </Box>
        </Stack>
      </Paper>

      {/* Link */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Links
        </Typography>
        <Stack spacing={3} direction="row" justifyContent="space-evenly">
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Underline Options
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="none">
                No underline
              </Link>
              <Link href="#" underline="hover">
                Underline on hover
              </Link>
              <Link href="#" underline="always">
                Always underline
              </Link>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Colors
            </Typography>
            <Stack spacing={1}>
              <Link href="#" color="primary">
                Primary Link
              </Link>
              <Link href="#" color="secondary">
                Secondary Link
              </Link>
              <Link href="#" color="error">
                Error Link
              </Link>
              <Link href="#" color="success">
                Success Link
              </Link>
              <Link href="#" color="inherit">
                Inherit Color Link
              </Link>
              <Link href="#" color="text.primary">
                Text Primary Link
              </Link>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Variants
            </Typography>
            <Stack spacing={1}>
              <Link href="#" variant="body1">
                Body1 Link
              </Link>
              <Link href="#" variant="body2">
                Body2 Link
              </Link>
              <Link href="#" variant="h6">
                Heading Link
              </Link>
              <Link href="#" variant="caption">
                Caption Link
              </Link>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              In Text
            </Typography>
            <Typography>
              This is a paragraph with an{" "}
              <Link href="#" underline="hover">
                inline link
              </Link>{" "}
              inside of it. Links can be seamlessly integrated into your content.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
