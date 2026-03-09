import { Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Container sx={{ py: 4, minHeight: '70vh' }}>{children}</Container>
      <Footer />
    </>
  );
}
