import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import adminApi from '../../services/adminApi';

export default function LoginPage() {
  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const response = await adminApi.post('/admin/login', { email: data.get('email'), password: data.get('password') });
    localStorage.setItem('admin_token', response.data.data.token);
    location.href = '/admin';
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Paper component='form' onSubmit={submit} sx={{ p: 3, width: 320 }}>
        <Typography variant='h5'>Admin Login</Typography>
        <TextField name='email' label='Email' fullWidth sx={{ mt: 2 }} />
        <TextField name='password' label='Password' type='password' fullWidth sx={{ mt: 2 }} />
        <Button type='submit' variant='contained' fullWidth sx={{ mt: 2 }}>Sign in</Button>
      </Paper>
    </Box>
  );
}
