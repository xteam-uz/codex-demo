import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout() {
  return <Box sx={{ display: 'flex' }}><Sidebar /><Box sx={{ flexGrow: 1, bgcolor: '#F5F7FA', minHeight: '100vh' }}><Topbar /><Box sx={{ p: 3 }}><Outlet /></Box></Box></Box>;
}
