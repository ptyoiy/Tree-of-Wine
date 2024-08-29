import { useState } from 'react';
import { WineData } from '../../../utils/makeTree';

const notIncludes: (keyof WineData)[] = ['id', 'group', 'values'];
export default function useTooltip() {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipCoords, setTooltipCoords] = useState({ x: 0, y: 0 });
  const onMouseOver = (e: MouseEvent, d: WineData | undefined, text?: string) => {
    setTooltipContent(
      text
        ? text
        : Object.entries(d!)
            .filter(([key]) => !notIncludes.includes(key as keyof WineData))
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')
    );
    setTooltipVisible(true);
    setTooltipCoords({
      x: e.clientX,
      y: e.clientY,
    });
  };
  const onMouseOut = () => {
    setTooltipVisible(false);
  };

  return {
    tooltipContent,
    tooltipVisible,
    tooltipCoords,
    onMouseOver,
    onMouseOut,
  };
}
