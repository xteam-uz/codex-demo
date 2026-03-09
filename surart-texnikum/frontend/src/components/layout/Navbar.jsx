import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LanguageSwitcher from '../common/LanguageSwitcher';

const links = [
  ['/', 'Home'],
  ['/news', 'News'],
  ['/gallery', 'Gallery'],
  ['/application', 'Apply'],
  ['/contact', 'Contact']
];

export default function Navbar() {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Surart Texnikum
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {links.map(([href, label]) => (
            <Button key={href} color="inherit" component={RouterLink} to={href}>{label}</Button>
          ))}
        </Box>
        <LanguageSwitcher />
      </Toolbar>
    </AppBar>
  );
}
