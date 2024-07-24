import { Backdrop, CircularProgress } from '@mui/material';
import { ReactNode } from 'react';

export function LoadingBoundary({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading: boolean;
}) {
  if (isLoading)
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  return <>{children}</>;
}
