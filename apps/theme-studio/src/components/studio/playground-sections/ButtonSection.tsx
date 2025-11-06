"use client";

import { Button, Paper, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

export function ButtonSection(): JSX.Element {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Buttons
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
        <Button variant="contained" disabled>
          Disabled
        </Button>
        <Button variant="contained" size="small">
          Small
        </Button>
        <Button variant="contained" size="large">
          Large
        </Button>
        <Button variant="contained" startIcon={<Add />}>
          With Icon
        </Button>
        <Button variant="contained" endIcon={<Add />}>
          With Icon
        </Button>
        <Button color="primary">
          Primary
        </Button>
        <Button color="secondary">
          Secondary
        </Button>
        <Button color="success">
          Success
        </Button>
        <Button color="warning">
          Warning
        </Button>
      </Stack>
    </Paper>
  );
}
