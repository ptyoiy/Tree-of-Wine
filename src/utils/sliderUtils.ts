export function getMarks(currentValue: number) {
  const step = 30;
  return marks.map((mark, idx) => {
    const value = currentValue + (-(step * Math.floor(marks.length / 2)) + step * idx);
    const first = idx === 0;
    const last = idx === marks.length - 1;
    return {
      ...mark,
      label: `${(value + 360) % 360}˚` + ((first || last) ? ` [${first ? '-' : '+'}${90}]` : ''),
    };
  });
}

export function preventHorizontalKeyboardNavigation(event: React.KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
  }
}
export function toRadian(rotate: number) {
  return (rotate * PI) / 180;
}
export function normalizeAngle(angle: number) {
  return angle % (2 * PI);
}

export const { PI } = Math;
const marks = [
  {
    value: 0,
    label: undefined,
  },
  {
    value: 30,
    label: undefined,
  },
  {
    value: 60,
    label: undefined,
  },
  {
    value: 90,
    label: undefined,
  },
  {
    value: 120,
    label: undefined,
  },
  {
    value: 150,
    label: undefined,
  },
  {
    value: 180,
    label: undefined,
  },
];