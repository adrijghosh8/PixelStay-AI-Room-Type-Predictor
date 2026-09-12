import '../styles/errorPanel.css';

const MESSAGES = {
  network: {
    title: 'SIGNAL LOST',
    body: 'The prediction server could not be reached. Make sure the FastAPI backend is running.',
  },
  timeout: {
    title: 'NO RESPONSE',
    body: 'The model took too long to respond. Check that the backend is running and try again.',
  },
  validation: {
    title: 'LISTING REJECTED',
    body: 'The server could not accept these listing details. Double-check the values and try again.',
  },
  server: {
    title: 'MODEL ERROR',
    body: 'The prediction server ran into a problem processing this listing.',
  },
  malformed: {
    title: 'BAD TRANSMISSION',
    body: 'The server sent back a response the app could not understand.',
  },
};

export default function ErrorPanel({ kind, onRetry }) {
  const info = MESSAGES[kind] || MESSAGES.server;
  return (
    <div className="error-panel pixel-border" role="alert">
      <p className="error-panel__title pixel-heading">⚠ {info.title}</p>
      <p className="error-panel__body">{info.body}</p>
      {onRetry && (
        <button className="error-panel__retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
