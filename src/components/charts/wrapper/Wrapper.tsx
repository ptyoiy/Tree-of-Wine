import { Paper, PaperProps } from '@mui/material';
import {
  ComponentProps,
  ComponentType,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LoadingBoundary } from '../../layout/LoadingBoundary';

export type Size = { width: number; height: number };

type ChartProps<T extends ComponentType<ComponentProps<T>>> = PaperProps & {
  render: T;
  chartProps: ComponentProps<T>;
};
export default function Chart<T extends ComponentType<ComponentProps<T>>>({
  render,
  chartProps,
  ...props
}: ChartProps<T>) {
  const parentRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;
  const AutoSizedChart = useMemo(() => autoSizingWrapper(render), [render]);
  return (
    <Paper {...props} ref={parentRef}>
      <AutoSizedChart {...chartProps} parentRef={parentRef} />
    </Paper>
  );
}

function autoSizingWrapper<P>(Chart: ComponentType<P>) {
  type PropsWithRef = P & { parentRef: MutableRefObject<HTMLDivElement> };

  return (props: PropsWithRef) => {
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });
    useEffect(() => {
      setSize({
        width: props.parentRef.current?.clientWidth,
        height: props.parentRef.current?.clientHeight,
      });
    }, [props.parentRef]);
    return (
      <LoadingBoundary isLoading={!props.parentRef.current}>
        <Chart {...props} size={size} />
      </LoadingBoundary>
    );
  };
}
