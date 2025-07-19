
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full py-6 bg-white shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/imgs/Logo.png" alt="Agenriver Logo" width={140} height={40} />
        </Link>
        <nav className="space-x-6 text-sm font-medium text-gray-800">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
