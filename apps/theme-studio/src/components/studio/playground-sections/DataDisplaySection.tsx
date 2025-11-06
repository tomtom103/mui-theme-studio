"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Paper,
  Stack,
  Avatar,
  AvatarGroup,
  Badge,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Favorite,
  Share,
  CloudUpload,
  Inbox,
  Drafts,
  Send,
  Mail,
  Delete,
  Info,
  Home,
  Settings,
  AccountCircle,
  Search,
  ShoppingCart,
  Notifications,
  Star,
  FavoriteBorder,
  Add,
  Remove,
  Edit,
  Check,
  Close,
  Visibility,
  VisibilityOff,
  ThumbUp,
  ThumbDown,
  Warning,
  Error,
  CheckCircle,
  Help,
  Download,
  Upload,
  Print,
  AttachFile,
  Camera,
  Image,
  Mic,
  Videocam,
  Phone,
  Email,
  CalendarToday,
  AccessTime,
  Place,
  People,
  Person,
  Lock,
  LockOpen,
  Refresh,
  MoreVert,
  Menu,
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  ArrowDownward,
  Folder,
  Work,
  School,
  Flight,
  Hotel,
  Restaurant,
  LocalCafe,
  DirectionsCar,
  DirectionsBike,
  DirectionsWalk,
  Message,
  Forum,
} from "@mui/icons-material";

export function DataDisplaySection(): JSX.Element {
  return (
    <>
      {/* Cards */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Cards
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Card Title
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This is a sample card with some content to demonstrate the
                  theme styling.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
                <Button size="small" color="primary">
                  Action
                </Button>
              </CardActions>
            </Card>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Outlined Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cards can have different elevations and borders.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Favorite />}>
                  Like
                </Button>
                <Button size="small" startIcon={<Share />}>
                  Share
                </Button>
              </CardActions>
            </Card>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Card
              sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
            >
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Colored Card
                </Typography>
                <Typography variant="body2">
                  Cards can use theme colors for backgrounds.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" sx={{ color: "inherit" }}>
                  Action
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Stack>
      </Paper>

      {/* Chips */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Chips
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="Default" />
          <Chip label="Primary" color="primary" />
          <Chip label="Secondary" color="secondary" />
          <Chip label="Success" color="success" />
          <Chip label="Error" color="error" />
          <Chip label="Warning" color="warning" />
          <Chip label="Info" color="info" />
          <Chip label="Clickable" onClick={() => {}} />
          <Chip label="Deletable" onDelete={() => {}} />
          <Chip label="With Icon" icon={<CloudUpload />} />
        </Stack>
      </Paper>

      {/* Typography Scale */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Typography
        </Typography>
        <Stack spacing={2}>
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="h4">Heading 4</Typography>
          <Typography variant="h5">Heading 5</Typography>
          <Typography variant="h6">Heading 6</Typography>
          <Typography variant="body1">
            Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
          <Typography variant="body2">
            Body 2: Smaller body text for secondary content.
          </Typography>
          <Typography variant="caption">Caption text</Typography>
          <Typography variant="overline">Overline text</Typography>
        </Stack>
      </Paper>

      {/* Avatars */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Avatars
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Variants
            </Typography>
            <Stack direction="row" spacing={2}>
              <Avatar>H</Avatar>
              <Avatar variant="rounded">N</Avatar>
              <Avatar variant="square">S</Avatar>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Sizes
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 24, height: 24, fontSize: "0.875rem" }}>
                S
              </Avatar>
              <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
              <Avatar sx={{ width: 56, height: 56 }}>L</Avatar>
              <Avatar sx={{ width: 64, height: 64 }}>XL</Avatar>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Colors
            </Typography>
            <Stack direction="row" spacing={2}>
              <Avatar sx={{ bgcolor: "primary.main" }}>P</Avatar>
              <Avatar sx={{ bgcolor: "secondary.main" }}>S</Avatar>
              <Avatar sx={{ bgcolor: "success.main" }}>S</Avatar>
              <Avatar sx={{ bgcolor: "error.main" }}>E</Avatar>
              <Avatar sx={{ bgcolor: "warning.main" }}>W</Avatar>
              <Avatar sx={{ bgcolor: "info.main" }}>I</Avatar>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Avatar Group
            </Typography>
            <AvatarGroup max={4}>
              <Avatar alt="User 1" sx={{ bgcolor: "primary.main" }}>
                U1
              </Avatar>
              <Avatar alt="User 2" sx={{ bgcolor: "secondary.main" }}>
                U2
              </Avatar>
              <Avatar alt="User 3" sx={{ bgcolor: "success.main" }}>
                U3
              </Avatar>
              <Avatar alt="User 4" sx={{ bgcolor: "error.main" }}>
                U4
              </Avatar>
              <Avatar alt="User 5" sx={{ bgcolor: "warning.main" }}>
                U5
              </Avatar>
            </AvatarGroup>
          </Box>
        </Stack>
      </Paper>

      {/* Badges */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Badges
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Basic Badges
            </Typography>
            <Stack direction="row" spacing={3}>
              <Badge badgeContent={4} color="primary">
                <Mail />
              </Badge>
              <Badge badgeContent={10} color="secondary">
                <Mail />
              </Badge>
              <Badge badgeContent={99} color="error">
                <Mail />
              </Badge>
              <Badge badgeContent={100} max={99} color="success">
                <Mail />
              </Badge>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Dot Badges
            </Typography>
            <Stack direction="row" spacing={3}>
              <Badge variant="dot" color="primary">
                <Mail />
              </Badge>
              <Badge variant="dot" color="secondary">
                <Mail />
              </Badge>
              <Badge variant="dot" color="error">
                <Mail />
              </Badge>
              <Badge variant="dot" color="success">
                <Mail />
              </Badge>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Badge Positions
            </Typography>
            <Stack direction="row" spacing={3}>
              <Badge
                badgeContent={4}
                color="primary"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Mail />
              </Badge>
              <Badge
                badgeContent={4}
                color="secondary"
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <Mail />
              </Badge>
              <Badge
                badgeContent={4}
                color="error"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Mail />
              </Badge>
              <Badge
                badgeContent={4}
                color="success"
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              >
                <Mail />
              </Badge>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Lists */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Lists
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Basic List
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Inbox />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Drafts />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Send />
                </ListItemIcon>
                <ListItemText primary="Sent" />
              </ListItem>
            </List>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Interactive List
            </Typography>
            <List>
              <ListItemButton>
                <ListItemIcon>
                  <Inbox />
                </ListItemIcon>
                <ListItemText primary="Inbox" secondary="5 new messages" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <Drafts />
                </ListItemIcon>
                <ListItemText primary="Drafts" secondary="2 drafts" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <Send />
                </ListItemIcon>
                <ListItemText primary="Sent" />
              </ListItemButton>
            </List>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              List with Avatars
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Alice Johnson"
                  secondary="Software Engineer"
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "secondary.main" }}>B</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Bob Smith"
                  secondary="Product Manager"
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "success.main" }}>C</Avatar>
                </ListItemAvatar>
                <ListItemText primary="Carol White" secondary="Designer" />
              </ListItem>
            </List>
          </Box>
        </Stack>
      </Paper>

      {/* Dividers */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dividers
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Horizontal Divider
            </Typography>
            <Box>
              <Typography variant="body2">Content above</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">Content below</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Divider with Text
            </Typography>
            <Divider>CENTER</Divider>
            <Divider textAlign="left">LEFT</Divider>
            <Divider textAlign="right">RIGHT</Divider>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Vertical Divider
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Typography>Item 1</Typography>
              <Typography>Item 2</Typography>
              <Typography>Item 3</Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              In a List
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Item 1" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="Item 2" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="Item 3" />
              </ListItem>
            </List>
          </Box>
        </Stack>
      </Paper>

      {/* Tooltips */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tooltips
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Basic Tooltips
            </Typography>
            <Stack direction="row" spacing={2}>
              <Tooltip title="Delete">
                <IconButton>
                  <Delete />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add to favorites">
                <IconButton>
                  <Favorite />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton>
                  <Share />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Tooltip Positions
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Tooltip title="Top Start" placement="top-start">
                <Button>Top Start</Button>
              </Tooltip>
              <Tooltip title="Top" placement="top">
                <Button>Top</Button>
              </Tooltip>
              <Tooltip title="Top End" placement="top-end">
                <Button>Top End</Button>
              </Tooltip>
              <Tooltip title="Bottom Start" placement="bottom-start">
                <Button>Bottom Start</Button>
              </Tooltip>
              <Tooltip title="Bottom" placement="bottom">
                <Button>Bottom</Button>
              </Tooltip>
              <Tooltip title="Bottom End" placement="bottom-end">
                <Button>Bottom End</Button>
              </Tooltip>
              <Tooltip title="Left" placement="left">
                <Button>Left</Button>
              </Tooltip>
              <Tooltip title="Right" placement="right">
                <Button>Right</Button>
              </Tooltip>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Arrow Tooltips
            </Typography>
            <Stack direction="row" spacing={2}>
              <Tooltip title="With arrow" arrow>
                <Button>Arrow</Button>
              </Tooltip>
              <Tooltip title="Detailed information in tooltip" arrow>
                <IconButton color="primary">
                  <Info />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Stack>
      </Paper>
      {/* Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Table
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dessert</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  hover
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

// Sample data for Table
const tableData = [
  { name: "Frozen yogurt", calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: "Ice cream sandwich", calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
  { name: "Eclair", calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
  { name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
  { name: "Gingerbread", calories: 356, fat: 16.0, carbs: 49, protein: 3.9 },
];
