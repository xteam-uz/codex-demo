import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <Button color="inherit" onClick={() => i18n.changeLanguage(i18n.language === 'uz' ? 'en' : 'uz')}>
      {i18n.language.toUpperCase()}
    </Button>
  );
}
