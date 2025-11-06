"use client";

import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  Rating,
  Autocomplete,
  Fab,
  ButtonGroup,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardHeader,
  Divider,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
} from "@mui/icons-material";
import { useState } from "react";

export function InputSection(): JSX.Element {
  const [transferListChecked, setTransferListChecked] = useState<number[]>([]);
  const [transferListLeft, setTransferListLeft] = useState<number[]>([0, 1, 2, 3]);
  const [transferListRight, setTransferListRight] = useState<number[]>([4, 5, 6, 7]);

  const leftChecked = intersection(transferListChecked, transferListLeft);
  const rightChecked = intersection(transferListChecked, transferListRight);

  const handleToggle = (value: number) => () => {
    const currentIndex = transferListChecked.indexOf(value);
    const newChecked = [...transferListChecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setTransferListChecked(newChecked);
  };

  const handleAllRight = () => {
    setTransferListRight(transferListRight.concat(transferListLeft));
    setTransferListLeft([]);
  };

  const handleCheckedRight = () => {
    setTransferListRight(transferListRight.concat(leftChecked));
    setTransferListLeft(not(transferListLeft, leftChecked));
    setTransferListChecked(not(transferListChecked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setTransferListLeft(transferListLeft.concat(rightChecked));
    setTransferListRight(not(transferListRight, rightChecked));
    setTransferListChecked(not(transferListChecked, rightChecked));
  };

  const handleAllLeft = () => {
    setTransferListLeft(transferListLeft.concat(transferListRight));
    setTransferListRight([]);
  };

  const customList = (items: number[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={`${numberOfChecked(items)}/${items.length} selected`}
        subheader=" "
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: number) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={transferListChecked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`List item ${value + 1}`} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  const numberOfChecked = (items: number[]) =>
    intersection(transferListChecked, items).length;

  const handleToggleAll = (items: number[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setTransferListChecked(not(transferListChecked, items));
    } else {
      setTransferListChecked(union(transferListChecked, items));
    }
  };

  return (
    <>
      {/* Text Fields and Select */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Form Inputs
        </Typography>
        <Stack spacing={3}>
          <TextField label="Text Field" placeholder="Enter text..." />
          <TextField
            label="Outlined"
            variant="outlined"
            helperText="Helper text"
          />
          <TextField label="Filled" variant="filled" />
          <TextField
            label="Error State"
            error
            helperText="This field is required"
          />
          <TextField label="Disabled" disabled value="Disabled input" />

          <FormControl fullWidth>
            <InputLabel>Select Option</InputLabel>
            <Select label="Select Option" value={1}>
              <MenuItem value={1}>Option 1</MenuItem>
              <MenuItem value={2}>Option 2</MenuItem>
              <MenuItem value={3}>Option 3</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Checkboxes */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Checkboxes
        </Typography>
        <Stack spacing={2}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Checked"
            />
            <FormControlLabel control={<Checkbox />} label="Unchecked" />
            <FormControlLabel
              control={<Checkbox indeterminate />}
              label="Indeterminate"
            />
            <FormControlLabel
              control={<Checkbox disabled />}
              label="Disabled"
            />
            <FormControlLabel
              control={<Checkbox disabled checked />}
              label="Disabled Checked"
            />
          </FormGroup>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Color Variants
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Default"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="primary" />}
              label="Primary"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="secondary" />}
              label="Secondary"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="success" />}
              label="Success"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="error" />}
              label="Error"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="warning" />}
              label="Warning"
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Radio Buttons */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Radio Buttons
        </Typography>
        <Stack spacing={3}>
          <FormControl>
            <FormLabel>Gender</FormLabel>
            <RadioGroup defaultValue="female">
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
              <FormControlLabel
                value="disabled"
                disabled
                control={<Radio />}
                label="Disabled"
              />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Horizontal Layout</FormLabel>
            <RadioGroup row defaultValue="option1">
              <FormControlLabel
                value="option1"
                control={<Radio />}
                label="Option 1"
              />
              <FormControlLabel
                value="option2"
                control={<Radio />}
                label="Option 2"
              />
              <FormControlLabel
                value="option3"
                control={<Radio />}
                label="Option 3"
              />
            </RadioGroup>
          </FormControl>

          <Typography variant="subtitle2">Color Variants</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <FormControlLabel control={<Radio checked />} label="Default" />
            <FormControlLabel
              control={<Radio checked color="primary" />}
              label="Primary"
            />
            <FormControlLabel
              control={<Radio checked color="secondary" />}
              label="Secondary"
            />
            <FormControlLabel
              control={<Radio checked color="success" />}
              label="Success"
            />
            <FormControlLabel
              control={<Radio checked color="error" />}
              label="Error"
            />
            <FormControlLabel
              control={<Radio checked color="warning" />}
              label="Warning"
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Switches */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Switches
        </Typography>
        <Stack spacing={2}>
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Checked"
            />
            <FormControlLabel control={<Switch />} label="Unchecked" />
            <FormControlLabel control={<Switch disabled />} label="Disabled" />
            <FormControlLabel
              control={<Switch disabled checked />}
              label="Disabled Checked"
            />
          </FormGroup>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Sizes
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={<Switch defaultChecked size="small" />}
              label="Small"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Medium"
            />
          </Stack>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Color Variants
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Default"
            />
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Primary"
            />
            <FormControlLabel
              control={<Switch defaultChecked color="secondary" />}
              label="Secondary"
            />
            <FormControlLabel
              control={<Switch defaultChecked color="success" />}
              label="Success"
            />
            <FormControlLabel
              control={<Switch defaultChecked color="error" />}
              label="Error"
            />
            <FormControlLabel
              control={<Switch defaultChecked color="warning" />}
              label="Warning"
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Sliders */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sliders
        </Typography>
        <Stack spacing={4}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Default
            </Typography>
            <Slider defaultValue={30} />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Disabled
            </Typography>
            <Slider defaultValue={30} disabled />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Range Slider
            </Typography>
            <Slider defaultValue={[20, 60]} />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              With Marks
            </Typography>
            <Slider defaultValue={50} step={10} marks min={0} max={100} />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Custom Marks
            </Typography>
            <Slider
              defaultValue={20}
              marks={[
                { value: 0, label: "0°C" },
                { value: 25, label: "25°C" },
                { value: 50, label: "50°C" },
                { value: 75, label: "75°C" },
                { value: 100, label: "100°C" },
              ]}
            />
          </Box>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Color Variants
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Primary
              </Typography>
              <Slider defaultValue={30} color="primary" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Secondary
              </Typography>
              <Slider defaultValue={30} color="secondary" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Success
              </Typography>
              <Slider defaultValue={30} color="success" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Error
              </Typography>
              <Slider defaultValue={30} color="error" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Warning
              </Typography>
              <Slider defaultValue={30} color="warning" />
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* Rating */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Rating
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Default
            </Typography>
            <Rating defaultValue={3} />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Read Only
            </Typography>
            <Rating value={4} readOnly />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Disabled
            </Typography>
            <Rating value={2} disabled />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Half Precision
            </Typography>
            <Rating defaultValue={2.5} precision={0.5} />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Sizes
            </Typography>
            <Stack spacing={1}>
              <Rating defaultValue={3} size="small" />
              <Rating defaultValue={3} size="medium" />
              <Rating defaultValue={3} size="large" />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Custom Max Value
            </Typography>
            <Rating defaultValue={5} max={10} />
          </Box>
        </Stack>
      </Paper>

      {/* Autocomplete */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Autocomplete
        </Typography>
        <Stack spacing={3}>
          <Autocomplete
            options={top100Films}
            renderInput={(params) => (
              <TextField {...params} label="Movie" placeholder="Search..." />
            )}
          />

          <Autocomplete
            multiple
            options={top100Films}
            defaultValue={[top100Films[0], top100Films[1]]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Multiple"
                placeholder="Select movies"
              />
            )}
          />

          <Autocomplete
            freeSolo
            options={top100Films}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Free Solo"
                placeholder="Type or select"
              />
            )}
          />

          <Autocomplete
            disabled
            options={top100Films}
            renderInput={(params) => <TextField {...params} label="Disabled" />}
          />

          <Autocomplete
            options={top100Films}
            renderInput={(params) => (
              <TextField
                {...params}
                label="With Helper Text"
                helperText="Choose your favorite movie"
              />
            )}
          />
        </Stack>
      </Paper>

      {/* Floating Action Button */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Floating Action Buttons
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Variants
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Fab color="primary" aria-label="add">
                <AddIcon />
              </Fab>
              <Fab color="secondary" aria-label="edit">
                <EditIcon />
              </Fab>
              <Fab variant="extended">
                <AddIcon sx={{ mr: 1 }} />
                Extended
              </Fab>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Sizes
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Fab size="small" color="primary" aria-label="add">
                <AddIcon />
              </Fab>
              <Fab size="medium" color="primary" aria-label="add">
                <AddIcon />
              </Fab>
              <Fab size="large" color="primary" aria-label="add">
                <AddIcon />
              </Fab>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Colors
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Fab color="primary">
                <AddIcon />
              </Fab>
              <Fab color="secondary">
                <AddIcon />
              </Fab>
              <Fab color="success">
                <AddIcon />
              </Fab>
              <Fab color="error">
                <AddIcon />
              </Fab>
              <Fab color="warning">
                <AddIcon />
              </Fab>
              <Fab color="info">
                <AddIcon />
              </Fab>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Button Group */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Button Groups
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Basic Group
            </Typography>
            <ButtonGroup variant="contained">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Variants
            </Typography>
            <Stack spacing={2}>
              <ButtonGroup variant="outlined">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
              <ButtonGroup variant="text">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Sizes & Orientation
            </Typography>
            <Stack spacing={2}>
              <ButtonGroup size="small">
                <Button>Small</Button>
                <Button>Small</Button>
              </ButtonGroup>
              <ButtonGroup size="large">
                <Button>Large</Button>
                <Button>Large</Button>
              </ButtonGroup>
              <ButtonGroup orientation="vertical" variant="contained">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Colors
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <ButtonGroup variant="contained" color="primary">
                <Button>Primary</Button>
                <Button>Group</Button>
              </ButtonGroup>
              <ButtonGroup variant="contained" color="secondary">
                <Button>Secondary</Button>
                <Button>Group</Button>
              </ButtonGroup>
              <ButtonGroup variant="contained" color="success">
                <Button>Success</Button>
                <Button>Group</Button>
              </ButtonGroup>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Toggle Button */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Toggle Buttons
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Text Alignment
            </Typography>
            <ToggleButtonGroup exclusive defaultValue="left">
              <ToggleButton value="left" aria-label="left aligned">
                <FormatAlignLeft />
              </ToggleButton>
              <ToggleButton value="center" aria-label="centered">
                <FormatAlignCenter />
              </ToggleButton>
              <ToggleButton value="right" aria-label="right aligned">
                <FormatAlignRight />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Text Formatting (Multiple)
            </Typography>
            <ToggleButtonGroup>
              <ToggleButton value="bold" aria-label="bold">
                <FormatBold />
              </ToggleButton>
              <ToggleButton value="italic" aria-label="italic">
                <FormatItalic />
              </ToggleButton>
              <ToggleButton value="underlined" aria-label="underlined">
                <FormatUnderlined />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Sizes
            </Typography>
            <Stack spacing={2}>
              <ToggleButtonGroup size="small" exclusive defaultValue="option1">
                <ToggleButton value="option1">Small</ToggleButton>
                <ToggleButton value="option2">Small</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup size="medium" exclusive defaultValue="option1">
                <ToggleButton value="option1">Medium</ToggleButton>
                <ToggleButton value="option2">Medium</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup size="large" exclusive defaultValue="option1">
                <ToggleButton value="option1">Large</ToggleButton>
                <ToggleButton value="option2">Large</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Colors
            </Typography>
            <Stack spacing={2}>
              <ToggleButtonGroup exclusive defaultValue="option1" color="primary">
                <ToggleButton value="option1">Primary</ToggleButton>
                <ToggleButton value="option2">Primary</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup exclusive defaultValue="option1" color="secondary">
                <ToggleButton value="option1">Secondary</ToggleButton>
                <ToggleButton value="option2">Secondary</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup exclusive defaultValue="option1" color="success">
                <ToggleButton value="option1">Success</ToggleButton>
                <ToggleButton value="option2">Success</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup exclusive defaultValue="option1" color="error">
                <ToggleButton value="option1">Error</ToggleButton>
                <ToggleButton value="option2">Error</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Vertical
            </Typography>
            <ToggleButtonGroup orientation="vertical" exclusive defaultValue="option1">
              <ToggleButton value="option1">Option 1</ToggleButton>
              <ToggleButton value="option2">Option 2</ToggleButton>
              <ToggleButton value="option3">Option 3</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </Paper>

      {/* Transfer List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Transfer List
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid>{customList(transferListLeft)}</Grid>
          <Grid>
            <Grid container direction="column" alignItems="center">
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleAllRight}
                disabled={transferListLeft.length === 0}
                aria-label="move all right"
              >
                ≫
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleAllLeft}
                disabled={transferListRight.length === 0}
                aria-label="move all left"
              >
                ≪
              </Button>
            </Grid>
          </Grid>
          <Grid>{customList(transferListRight)}</Grid>
        </Grid>
      </Paper>
    </>
  );
}

// Helper functions for Transfer List
function not(a: number[], b: number[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: number[], b: number[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: number[], b: number[]) {
  return [...a, ...not(b, a)];
}

// Sample data for Autocomplete
const top100Films = [
  "The Shawshank Redemption",
  "The Godfather",
  "The Dark Knight",
  "12 Angry Men",
  "Schindler's List",
  "Pulp Fiction",
  "The Lord of the Rings: The Return of the King",
  "The Good, the Bad and the Ugly",
  "Fight Club",
  "Forrest Gump",
  "Inception",
  "Star Wars: Episode V - The Empire Strikes Back",
  "The Lord of the Rings: The Fellowship of the Ring",
  "One Flew Over the Cuckoo's Nest",
  "Goodfellas",
  "The Matrix",
  "Seven Samurai",
  "City of God",
  "Se7en",
  "The Silence of the Lambs",
];
