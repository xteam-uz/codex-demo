import { Grid, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import AnimatedSection from '../../components/common/AnimatedSection';

export default function HomePage() {
  return (
    <>
      <Paper sx={{ p: 6, mb: 4, background: 'linear-gradient(135deg, #1565C0, #1A237E)', color: 'white' }}>
        <Typography variant="h2" fontWeight={700}>Surart Technical College</Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>Modern education shaping specialists of tomorrow</Typography>
        <Button variant="contained" color="secondary" sx={{ mt: 3 }}>Apply Now</Button>
      </Paper>
      <AnimatedSection>
        <Grid container spacing={2}>
          {["Students", "Teachers", "Years"].map((item, i) => (
            <Grid item xs={12} md={4} key={item}>
              <motion.div whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }} whileTap={{ scale: 0.97 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h4" color="primary">{[1200, 95, 25][i]}+</Typography>
                  <Typography>{item}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </AnimatedSection>
    </>
  );
}
