import { Box, Paper } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { wineSelectionSelector } from '../../../recoil/search';
import { Search } from '../search';

const LeftSection = () => {
  const selection = useRecoilValue(wineSelectionSelector);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        width: '20%',
        border: 'solid 1px black',
        gap: '1px',
      }}
    >
      <Search />
      <Paper>
        {selection.map((sel) => (
          <p key={sel.Designation}>{sel.Designation}</p>
        ))}
      </Paper>
    </Box>
  );
};

export default LeftSection;
