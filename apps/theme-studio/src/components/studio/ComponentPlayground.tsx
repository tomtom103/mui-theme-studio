"use client";

import { Stack, Typography } from "@mui/material";
import {
  ButtonSection,
  InputSection,
  DataDisplaySection,
  FeedbackSection,
  NavigationSection,
} from "./playground-sections";

export default function ComponentPlayground(): JSX.Element {
  return (
    <Stack spacing={4}>
      <Typography variant="h4" gutterBottom>
        Live Component Preview
      </Typography>

      <ButtonSection />
      <InputSection />
      <DataDisplaySection />
      <FeedbackSection />
      <NavigationSection />
    </Stack>
  );
}
