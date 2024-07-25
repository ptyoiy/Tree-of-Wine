import { useState } from "react";
import { WineData } from "../../../utils/makeTree";

export default function useTooltip() {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipCoords, setTooltipCoords] = useState({ x: 0, y: 0 });
  const onMouseOver = (e: MouseEvent, d: WineData) => {
    setTooltipContent(
      Object.entries(d)
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
