import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: "'Outfit', sans-serif"
        }}>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--loyum-sand-border)',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '520px',
            boxShadow: '0 8px 30px rgba(0, 31, 70, 0.08)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(242, 177, 47, 0.15)',
              color: 'var(--loyum-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 1.25rem'
            }}>
              ⚠️
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--loyum-navy)', fontSize: '1.25rem', fontWeight: 700 }}>
              Temporary Rendering Notice
            </h3>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--loyum-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              The component encountered a temporary update state. Please refresh or return to the overview.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button 
                onClick={this.handleReload}
                className="btn-primary"
                style={{ padding: '0.65rem 1.4rem' }}
              >
                Refresh View
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
