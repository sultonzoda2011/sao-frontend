import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-xl font-extrabold">
            Что-то пошло не так
          </h1>
          <p className="text-sm text-mist">Попробуйте обновить страницу.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Обновить
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
