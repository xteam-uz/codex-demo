import { Box, Container, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 4, bgcolor: '#1A1A2E', color: 'white', mt: 6 }}>
      <Container>
        <Typography>© {new Date().getFullYear()} Surart Texnikum</Typography>
      </Container>
    </Box>
  );
}
