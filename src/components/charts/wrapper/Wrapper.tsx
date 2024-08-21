import React, { MutableRefObject, useEffect, useState } from 'react';
import { LoadingBoundary } from '../../layout/LoadingBoundary';

export type Size = { width: number; height: number };

export default function autoSizingWrapper<P>(Component: React.ComponentType<P>) {
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
        <Component {...props} size={size} />
      </LoadingBoundary>
    );
  };
}
