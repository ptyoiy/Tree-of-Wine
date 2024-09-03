/* eslint-disable react-refresh/only-export-components */
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { darken, lighten, styled, Theme } from '@mui/material';
import { memo } from 'react';

export const GroupHeader = memo(styled('div')(({ theme }: { theme: Theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  zIndex: 999,
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
})), (prev, next) => prev.theme != next.theme);
export const GroupItems = memo(styled('ul')({
  padding: 0,
}));
export const Icon = memo(() => <CheckBoxOutlineBlankIcon fontSize="small" />);
export const CheckedIcon = memo(() => <CheckBoxIcon fontSize="small" />);
