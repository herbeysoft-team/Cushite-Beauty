import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAFAFA] text-center">
      <h1
        className="text-6xl font-bold"
        style={{ fontFamily: "Playfair Display", color: "#4A136C" }}
      >
        404
      </h1>
      <p className="text-lg text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="rounded-full px-6 py-3 text-white"
        style={{ background: "#4A136C", fontFamily: "'Poppins', sans-serif" }}
      >
        Back to Home
      </Link>
    </main>
  );
}

export default NotFound;
