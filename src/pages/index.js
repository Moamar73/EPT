
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
  return (
    <>
      <Head>
        <title>Agenriver – Creative Portfolio Agency</title>
        <meta name="description" content="Creative Portfolio & Agency website built with Next.js. Modern design, responsive layout, and SEO-optimized." />
        <meta property="og:title" content="Agenriver – Creative Portfolio Agency" />
        <meta property="og:description" content="Showcase your work with style using the Agenriver portfolio theme." />
        <meta property="og:type" content="website" />
      </Head>

      <header className="site-header">
        <Header />
        <h1>Agenriver – Creative Agency</h1>
      </header>

      <main>
        <section className="agt-blog-feed-section pt-130 pb-130">
          <div className="container">
            <div className="row">
              {/* Simulated blog card loop */}
              {[1, 2, 3].map((item) => (
                <div className="col-lg-4 mb-4" key={item}>
                  <div className="post-card shadow p-4 bg-white">
                    <Image src="/imgs/default-blog.svg" alt="Blog Image" width={600} height={400} />
                    <h2 className="text-xl font-bold mt-4">عنوان التدوينة</h2>
                    <p className="text-gray-600">مقتطف من المحتوى التعريفي...</p>
                    <Link href={`/post/${item}`} className="text-blue-600 underline">قراءة المزيد</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer bg-black text-white p-6 text-center">
        <Footer />
        <p>© 2025 Agenriver. All rights reserved.</p>
      </footer>
    </>
  );
}
