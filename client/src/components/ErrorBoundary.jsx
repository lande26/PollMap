import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled application error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
          <div className="max-w-md w-full rounded-3xl border border-white/10 bg-[#10172A]/90 p-8 text-center shadow-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300 mb-3">PollMap</p>
            <h1 className="text-2xl font-semibold text-white mb-3">Something went wrong</h1>
            <p className="text-sm text-gray-300 mb-6">
              The app hit an unexpected error. Reload to recover.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
