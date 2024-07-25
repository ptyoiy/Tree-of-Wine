interface TooltipProps {
  content: string;
  x: number;
  y: number;
  visible: boolean;
}

const height = document.body.clientHeight;
const Tooltip: React.FC<TooltipProps> = ({ content, x, y, visible }) => {
  const top = y + (y < (height / 2) ? 10 : -180);
  const left = x + 10;
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '5px',
        borderRadius: '5px',
        visibility: visible ? 'visible' : 'hidden',
        pointerEvents: 'none',
        zIndex: 1000,
        whiteSpace: 'pre',
      }}
    >
      {content}
    </div>
  );
};

export default Tooltip;
