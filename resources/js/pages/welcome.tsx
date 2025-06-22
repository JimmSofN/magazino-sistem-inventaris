import type { SharedData } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const teamMembers = [
        { name: "Jimmy Putra Alam", role: "53220029", image: "storage/images/jimmy.png" },
        { name: "Dayren Rafly Gunawan", role: "59220148", image: "storage/images/dayren.jpg" },
        { name: "Kevin Sandjaya", role: "50220060", image: "storage/images/kevin.jpeg" },
        { name: "Felix Valentino", role: "50220060", image: "storage/images/felix.jpeg" },
        { name: "Albert Rizal", role: "50220060", image: "storage/images/albert.jpeg" },
    ];

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header */}
                <header className="w-full border-b border-[#19140035] dark:border-[#3E3E3A] py-4">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <div className="text-xl font-semibold">Magazino</div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Selamat Datang Di Magazino</h1>
                            <p className="text-lg md:text-xl mb-8 text-[#1b1b18]/80 dark:text-[#EDEDEC]/80">
                                Sistem Inventaris Yang Membantu Integrasi Gudang Dalam Mengelola Barang
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href={auth.user ? route("dashboard") : route("login")}
                                    className="inline-block rounded-sm bg-[#1b1b18] px-6 py-3 text-sm font-medium text-white hover:bg-[#1b1b18]/90 dark:bg-[#EDEDEC] dark:text-[#0a0a0a] dark:hover:bg-[#EDEDEC]/90"
                                >
                                    Mulai
                                </Link>
                                <Link
                                    href="#about"
                                    className="inline-block rounded-sm border border-[#19140035] px-6 py-3 text-sm font-medium hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                >
                                    Selengkapnya
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 bg-[#F8F8F6] dark:bg-[#121212]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Tim Kami</h2>
                            <p className="text-[#1b1b18]/80 dark:text-[#EDEDEC]/80">
                                Para Anggota Kami
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
                                {teamMembers.map((member, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="text-lg font-medium">{member.name}</h3>
                                        <p className="text-sm text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">{member.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Accordion Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold mb-8 text-center">Pertanyaan yang Sering Diajukan</h2>

                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-left">Layanan apa saja yang kalian tawarkan?</AccordionTrigger>
                                    <AccordionContent>
                                        Kami menyediakan sistem inventaris gudang digital yang mencakup pengelolaan stok barang, pelacakan keluar masuk barang, notifikasi stok menipis, serta laporan aktivitas inventaris secara real-time.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-left">Bagaimana cara memulai menggunakan sistem ini?</AccordionTrigger>
                                    <AccordionContent>
                                        Anda cukup mendaftar akun di platform kami. Setelah itu, Anda bisa langsung mulai menggunakan sistem dengan mengikuti panduan onboarding yang tersedia untuk mengatur gudang dan produk Anda.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-left">Apakah kalian menyediakan dukungan pelanggan?</AccordionTrigger>
                                    <AccordionContent>
                                        Ya, kami menyediakan dukungan pelanggan 24/7 melalui live chat, email, dan telepon. Tim support kami siap membantu Anda jika mengalami kendala saat menggunakan sistem.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-4">
                                    <AccordionTrigger className="text-left">Apa yang membuat tim kalian berbeda?</AccordionTrigger>
                                    <AccordionContent>
                                        Tim kami terdiri dari ahli teknologi dan pengelolaan gudang yang berpengalaman. Kami fokus pada solusi yang praktis, efisien, dan sesuai dengan kebutuhan operasional gudang di berbagai industri.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-5">
                                    <AccordionTrigger className="text-left">Apakah sistem ini bisa disesuaikan?</AccordionTrigger>
                                    <AccordionContent>
                                        Tentu. Kami menawarkan solusi yang dapat disesuaikan sesuai kebutuhan spesifik bisnis Anda, mulai dari fitur tambahan, integrasi dengan sistem lain, hingga pelaporan khusus.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 border-t border-[#19140035] dark:border-[#3E3E3A]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <p className="text-sm text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                                    © {new Date().getFullYear()} Magazino - Sistem Inventaris. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div >
        </>
    );
}