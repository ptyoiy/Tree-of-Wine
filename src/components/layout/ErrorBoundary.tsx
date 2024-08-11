import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | undefined;
  errorInfo: ErrorInfo | undefined;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: undefined, errorInfo: undefined };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: undefined };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    return { hasError: true, error, errorInfo };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>name: {this.state.error?.name}</p>
          <p>message: {this.state.error?.message}</p>
          <p>stack: {this.state.errorInfo?.componentStack}</p>
          <p>digest: {this.state.errorInfo?.digest}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
