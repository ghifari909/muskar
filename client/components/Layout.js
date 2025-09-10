export default function Layout({ children }) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}