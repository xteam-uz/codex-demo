import { AppBar, Toolbar, Typography, Button } from '@mui/material';
export default function Topbar(){return <AppBar position='static' color='inherit' elevation={1}><Toolbar><Typography sx={{flexGrow:1}}>Admin</Typography><Button onClick={()=>localStorage.removeItem('admin_token')}>Logout</Button></Toolbar></AppBar>}
