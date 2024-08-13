import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Slider, { SliderThumb } from '@mui/material/Slider';
import * as d3 from 'd3';
import * as React from 'react';
import {
  getMarks,
  normalizeAngle,
  PI,
  preventHorizontalKeyboardNavigation,
  toRadian,
} from '../../utils/sliderUtils';

export default function RotateSlider({
  svgRef,
}: {
  svgRef: React.MutableRefObject<SVGSVGElement>;
}) {
  const [sliderValue, setSliderValue] = React.useState(90);
  const [rotateValue, setRotateValue] = React.useState(0);
  const sizeRef = React.useRef(0);
  const svgSelectionRef = React.useRef<d3.Selection<SVGSVGElement, unknown, null, undefined>>();

  React.useEffect(() => {
    const svgSelection = d3.select(svgRef.current);
    svgSelectionRef.current = svgSelection;
    setTimeout(() => {
      sizeRef.current = +svgSelection.attr('height');
    });
  }, [svgRef]);

  const onChangeHandler = React.useCallback((value: number) => {
    const halfSize = sizeRef.current / 2;
    svgSelectionRef.current
      ?.select('g.mouse-move')
      .attr('transform', `translate(50, 0)rotate(${value - 90}, ${halfSize}, ${halfSize})`);
      
    setSliderValue(value);
  }, []);

  /** 오래 걸리는 작업은 onChange 종료 후 호출 */
  const onChangeCommittedHandler = React.useCallback((value: number) => {
    const svg = svgSelectionRef.current!;
    const halfSize = sizeRef.current / 2;
    let rotate = rotateValue;
    rotate += value - 90;
    // rotate %= 360;
    if (rotate > 360) rotate %= 360;
    else if (rotate < 0) rotate = (360 + rotate) % 360;
    const rotateToRadian = toRadian(rotate);

    svg
      .select('g.mouse-move')
      .attr('transform', `translate(50, 0)`);
    svg
      .select('g.mouse-up')
      .attr('transform', `translate(${halfSize}, ${halfSize})rotate(${rotate})`)
      .selectAll('text')
      .attr('x', (d: any) => (normalizeAngle(d.x! + rotateToRadian) < PI === !d.children ? 6 : -6))
      .attr('text-anchor', (d: any) =>
        normalizeAngle(d.x! + rotateToRadian) < PI === !d.children ? 'start' : 'end'
      )
      .attr(
        'transform',
        (d: any) => 'rotate(' + (normalizeAngle(d.x! + rotateToRadian) < PI ? 0 : 180) + ')'
      );

    setSliderValue(90);
    setRotateValue(rotate);
  }, [rotateValue]);

  return (
    <Box
      sx={{
        gridRow: '2 / 3',
        gridColumn: '2 / 3',
        alignSelf: 'center',
      }}
    >
      <GrabButtonSlider
        orientation="vertical"
        slots={{ thumb: Handle }}
        min={0}
        max={180}
        value={sliderValue}
        defaultValue={90}
        aria-label="Rotate"
        valueLabelDisplay="auto"
        valueLabelFormat={(slider) => {
          const value = (slider - 90 + rotateValue + 360) % 360;
          return `${value}˚`;
        }}
        marks={getMarks(rotateValue)}
        onChange={(_e, v) => onChangeHandler(v as number)}
        onChangeCommitted={(_e, v) => onChangeCommittedHandler(v as number)}
        onKeyDown={preventHorizontalKeyboardNavigation}
      />
    </Box>
  );
}

const GrabButtonSlider = styled(Slider)(() => ({
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
    '& .grab': {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    },
  },
}));

interface HandleProps extends React.HTMLAttributes<unknown> {}

function Handle(props: HandleProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <div className="wrapper">
        <span className="grab" />
        <span className="grab" />
        <span className="grab" />
      </div>
    </SliderThumb>
  );
}
