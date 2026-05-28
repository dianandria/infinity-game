import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from "@/Layouts/AppLayout";
// Import your layout component here if you use persistent layouts
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Faq() {
    // Array to hold the FAQ data
    const faqs = [
        {
            question: "Bagaimana cara melakukan pemesanan?",
            answer: "Anda dapat memesan langsung melalui website kami dengan memilih produk, menambahkannya ke keranjang belanja, dan mengikuti proses checkout."
        },
        {
            question: "Metode pembayaran apa saja yang diterima?",
            answer: "Kami hanya menerima pembayaran melalui **Virtual Account (VA)**. Setelah melakukan pemesanan, Anda akan mendapatkan nomor VA untuk menyelesaikan pembayaran sesuai instruksi yang tersedia."
        },
        {
            question: "Apakah saya perlu membuat akun untuk berbelanja?",
            answer: "Ya, Anda perlu login terlebih dahulu untuk dapat berbelanja."
        },
        {
            question: "Kapan pesanan saya akan dikirim?",
            answer: "Pesanan yang masuk dan terkonfirmasi pembayarannya sebelum pukul 15.00 WIB akan diproses pada hari yang sama. Pesanan di luar jam tersebut atau pada hari libur akan diproses pada hari kerja berikutnya."
        },
        {
            question: "Bagaimana cara melacak pesanan saya?",
            answer: "Nomor resi akan dikirimkan melalui email setelah pesanan Anda diserahkan ke pihak ekspedisi. Anda juga dapat melacak status pesanan melalui menu \"Lacak Pesanan\" di akun Anda."
        }
    ];

    // State to manage the currently open accordion item
    const [openIndex, setOpenIndex] = useState(null);

    // Toggle function to open/close the clicked accordion
    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <AppLayout>
            <Head title="FAQ - Twighouse Souvenir" />

            <div className="min-h-screen font-sans pb-24">
                <main className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <h1 className="text-[28px] font-bold text-gray-900 mb-3">FAQ</h1>
                        <p className="text-gray-500 text-[15px]">
                            Temukan jawaban untuk pertanyaan yang paling sering diajukan mengenai layanan kami di bawah ini.
                        </p>
                    </div>

                    {/* Accordion Container using exact Flowbite HTML structure */}
                    <div id="accordion-card">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            
                            return (
                                <React.Fragment key={index}>
                                    {/* Accordion Heading */}
                                    <h2 id={`accordion-card-heading-${index}`} className={index > 0 ? "mt-4" : ""}>
                                        <button 
                                            type="button" 
                                            onClick={() => toggleFAQ(index)}
                                            // Changed rounded-base to rounded-xl
                                            // Changed Flowbite custom colors to standard Tailwind (text-gray-900, border-gray-200)
                                            className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-900 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 gap-3 [&[aria-expanded='true']]:rounded-b-none [&[aria-expanded='true']]:shadow-none transition-colors" 
                                            aria-expanded={isOpen} 
                                            aria-controls={`accordion-card-body-${index}`}
                                        >
                                            <span className="text-left text-[15px] font-semibold">{faq.question}</span>
                                            
                                            {/* Accordion Icon */}
                                            <svg 
                                                className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`} 
                                                aria-hidden="true" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="24" 
                                                height="24" 
                                                fill="none" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7"/>
                                            </svg>
                                        </button>
                                    </h2>
                                    
                                    {/* Accordion Body */}
                                    <div 
                                        id={`accordion-card-body-${index}`} 
                                        // Changed rounded-b-base to rounded-b-xl
                                        // Used strict display block/hidden like the Flowbite template
                                        className={`${isOpen ? 'block' : 'hidden'} border border-t-0 border-gray-200 rounded-b-xl shadow-sm bg-white`} 
                                        aria-labelledby={`accordion-card-heading-${index}`}
                                    >
                                        <div className="p-4 md:p-5">
                                            <p className="mb-2 text-gray-600 text-[15px] leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>

                </main>
            </div>
        </AppLayout>
    );
}