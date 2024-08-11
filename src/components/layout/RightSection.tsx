import { Box } from '@mui/material';

const RightSection = () => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateRows: '1fr 1fr 1fr',
                height: '100vh',
                width: '350px',
                border: 'solid 1px black',
            }}
        >
            <Box
                sx={{

                    borderBottom: 'solid 1px black',
                }}
            >
                Bubble Chart
            </Box>
            <Box
                sx={{
                    borderBottom: 'solid 1px black',
                }}
            >
                Select Statistic Info Chart
            </Box>
            <Box >
                Mini-Map
            </Box>
        </Box>
    );
};

export default RightSection;
