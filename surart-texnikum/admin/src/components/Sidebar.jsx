import { Box, List, ListItemButton, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const items = ['','applications','gallery','leadership','library','mvp','news'];
export default function Sidebar(){return <motion.div initial={{x:-40,opacity:0}} animate={{x:0,opacity:1}}><Box sx={{width:260,bgcolor:'#1A237E',color:'#fff',minHeight:'100vh'}}><List>{items.map(i=><ListItemButton key={i} component={Link} to={`/admin/${i}`} sx={{color:'#fff'}}><ListItemText primary={i||'dashboard'} /></ListItemButton>)}</List></Box></motion.div>}
