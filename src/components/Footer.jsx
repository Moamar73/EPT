
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Agenriver. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
