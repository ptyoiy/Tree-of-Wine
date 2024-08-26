import { Backdrop, CircularProgress } from '@mui/material';
import { ReactNode, Suspense } from 'react';

export function LoadingBoundary({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading?: boolean;
}) {
  if (isLoading != undefined) {
    return <>{isLoading ? <Loading /> : children}</>;
  }
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

function Loading({ isLoading = true }: { isLoading?: boolean }) {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
