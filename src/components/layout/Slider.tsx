import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Slider, { SliderThumb } from '@mui/material/Slider';
import * as d3 from 'd3';
import * as React from 'react';

export default function RotateSlider({
  svgRef,
}: {
  svgRef: React.MutableRefObject<SVGSVGElement>;
}) {
  const sizeRef = React.useRef(0);
  const svgSelectionRef = React.useRef<d3.Selection<SVGSVGElement, unknown, null, undefined>>();
  React.useEffect(() => {
    const svgSelection = d3.select(svgRef.current);
    svgSelectionRef.current = svgSelection;
    setTimeout(() => {
      sizeRef.current = +svgSelection.attr('height');
    });
  }, [svgRef]);

  const onChangeHandler = (delta: number) => {
    // rotate += delta;
    // if (rotate > 360) rotate %= 360;
    // else if (rotate < 0) rotate = (360 + rotate) % 360;
    const size = sizeRef.current;

    svgSelectionRef.current
      ?.select('g.mouse-up')
      .attr('transform', `translate(${size / 2}, ${size / 2})rotate(${delta})`);
  };

  /** 오래 걸리는 작업이라 onChange 종료 후 호출하도록 함 */
  const onChangeCommittedHandler = (delta: number) => {
    const rotateToRadian = toRadian(delta);
    svgSelectionRef.current
      ?.select('g.mouse-up')
      .selectAll('text')
      .attr('x', (d: any) => (normalizeAngle(d.x! + rotateToRadian) < PI === !d.children ? 6 : -6))
      .attr('text-anchor', (d: any) =>
        normalizeAngle(d.x! + rotateToRadian) < PI === !d.children ? 'start' : 'end'
      )
      .attr(
        'transform',
        (d: any) => 'rotate(' + (normalizeAngle(d.x! + rotateToRadian) < PI ? 0 : 180) + ')'
      );
  };

  return (
    <Box
      sx={{
        gridRow: '2 / 3',
        gridColumn: '2 / 3',
        alignSelf: 'center',
      }}
    >
      <AirbnbSlider
        orientation="vertical"
        slots={{ thumb: Handle }}
        min={0}
        max={90}
        defaultValue={90}
        aria-label="Rotate"
        valueLabelDisplay="on"
        valueLabelFormat={getValue}
        marks={marks}
        onChange={(_e, v) => onChangeHandler(getValue(v as number))}
        onChangeCommitted={(_e, v) => onChangeCommittedHandler(getValue(v as number))}
        onKeyDown={preventHorizontalKeyboardNavigation}
      />
    </Box>
  );
}

const marks = [
  {
    value: 0,
    label: '90°',
  },
  {
    value: 15,
    label: '75°',
  },
  {
    value: 30,
    label: '60°',
  },
  {
    value: 45,
    label: '45°',
  },
  {
    value: 60,
    label: '30°',
  },
  {
    value: 75,
    label: '15°',
  },
  {
    value: 90,
    label: '0°',
  },
];
const { PI } = Math;
function preventHorizontalKeyboardNavigation(event: React.KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
  }
}
function toRadian(rotate: number) {
  return (rotate * PI) / 180;
}
function normalizeAngle(angle: number) {
  return angle % (2 * PI);
}
function getValue(value: number) {
  return 90 - value;
}

interface HandleProps extends React.HTMLAttributes<unknown> {}

function Handle(props: HandleProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <div className="wrapper">
        <span className="airbnb-bar" />
        <span className="airbnb-bar" />
        <span className="airbnb-bar" />
      </div>
    </SliderThumb>
  );
}

const AirbnbSlider = styled(Slider)(() => ({
  height: '300px',
  '& .MuiSlider-thumb': {
    height: 27,
    width: 27,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
    },
    '& .wrapper': {
      rotate: '90deg',
      display: 'flex',
    },
    '& .airbnb-bar': {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    },
  },
  '& .MuiSlider-rail': {
    color: '#3a8589',
    opacity: 1,
  },
  '& .MuiSlider-track': {
    color: '#bbd0cf',
  },
}));
