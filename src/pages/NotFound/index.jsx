import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-4 text-center"
      style={{ background: "linear-gradient(135deg,#4A136C 0%, #381055 100%)" }}
    >
      <h1
        className="text-6xl font-bold text-white"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        404
      </h1>
      <p className="text-lg text-white/70" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="rounded-full bg-white px-6 py-3 text-[#4A136C] transition-transform hover:scale-105"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        Back to Home
      </Link>
    </main>
  );
}

export default NotFound;
