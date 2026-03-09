import { Typography, Box } from '@mui/material';

export default function PageHeader({ title }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h3" fontWeight={700}>{title}</Typography>
    </Box>
  );
}
