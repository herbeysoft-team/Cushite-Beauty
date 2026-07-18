function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-[#4A136C]">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">
        Page Not Found
      </h2>

      <p className="mt-2 text-gray-500">
        Sorry, the page you're looking for doesn't exist.
      </p>
    </div>
  );
}

export default NotFound;