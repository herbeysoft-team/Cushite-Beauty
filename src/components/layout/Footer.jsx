function Footer() {
  return (
    <footer className="mt-20 border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 text-center">
        <p>
          © {new Date().getFullYear()} Cushite Beauty.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
