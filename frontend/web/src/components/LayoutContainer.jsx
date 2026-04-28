export default function LayoutContainer({ children }) {
  return (
    <div
      id="app-scroll-container"
      className="min-h-screen bg-surface overflow-x-hidden overflow-y-auto"
    >
      {children}
    </div>
  );
}
