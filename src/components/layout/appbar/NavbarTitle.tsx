import { Typography } from '@mui/material';

export default function NavbarTitle({ title }: { title: string }) {
  return (
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      {title}
    </Typography>
  );
}
