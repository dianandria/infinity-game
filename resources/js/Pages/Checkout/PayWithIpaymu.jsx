import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { Check, Clipboard, Clock3, Wallet } from "lucide-react";

const fmt = n => `Rp ${Number(n || 0).toLocaleString('id-ID')}`

export default function PayWithIpaymu({ order, ipaymu }) {
    const [copied, setCopied] = useState(false);
    console.log(ipaymu);
    // Ambil data langsung dari props ipaymu yang dikirim controller
    const paymentNo = ipaymu.payment_no ?? 'Nomor VA Tidak Tersedia';
    const channel = ipaymu.channel;
    const via = ipaymu.via;
    const expiredAt = ipaymu.expired_at ?? '-';
    const paymentName = ipaymu.payment_name;
    
    // Instruksi dinamis
    const dynamicInstructions = [
        { 
            label: `Melalui Mobile Banking (${channel} Mobile)`, 
            steps: [
                `Login ke aplikasi m-Banking ${channel}.`, 
                `Pilih menu 'Transfer' > '${channel} Virtual Account'.`, 
                `Masukkan Nomor VA: {paymentNo}.`, 
                `Konfirmasi detail pembayaran atas nama ${paymentName}.`, 
                `Masukkan PIN dan simpan bukti transaksi.`
            ]
        },
        { 
            label: `Melalui ATM ${channel}`, 
            steps: [
                `Masukkan Kartu & PIN ATM ${channel} Anda.`, 
                `Pilih menu 'Transaksi Lainnya' > 'Transfer' > 'Ke Rek ${channel} Virtual Account'.`, 
                `Masukkan Nomor VA: {paymentNo}.`, 
                `Pastikan nama merchant adalah ${paymentName} dan total tagihan sesuai.`, 
                `Konfirmasi pembayaran dan simpan struk.`
            ]
        }
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentNo).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <AppLayout>
            <Head title={`Pembayaran ${channel} - Infinity Game`} />

            <div className="bg-gray-50 min-h-screen py-16 px-4">
                <div className="mx-auto max-w-xl">
                    
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                        
                        {/* Header */}
                        <div className="bg-[#04668D] p-8 text-white text-center border-b border-dashed border-white/20">
                            <p className="text-white/80 text-sm tracking-wide font-medium">TOTAL PEMBAYARAN</p>
                            <h1 className="text-4xl font-extrabold mt-1 tracking-tight">
                                {fmt(ipaymu.amount)}
                            </h1>
                            <p className="mt-3 text-white/90 text-sm">
                                No Pesanan: <span className="font-mono bg-white/10 px-2 py-0.5 rounded">{order.code}</span>
                            </p>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-8">
                            
                            {/* Metode Pembayaran */}
                            <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                                    <span className="text-blue-800 font-extrabold text-xl">{channel}</span>
                                </div>
                                <div>
                                    <h2 className="text-gray-900 font-bold text-lg">Metode Pembayaran</h2>
                                    <p className="text-gray-800 font-medium">{channel} {via === 'VA' ? 'Virtual Account' : via}</p>
                                    <p className="text-gray-500 text-sm">a.n {paymentName}</p>
                                </div>
                            </div>

                            {/* Nomor VA */}
                            <div className="bg-gray-100/70 p-6 rounded-2xl">
                                <label className="text-gray-600 text-sm font-medium block mb-2">Nomor Virtual Account</label>
                                <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-gray-200 p-2 sm:pl-4 rounded-xl shadow-inner">
                                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[#ED1C24] flex-grow tracking-wider text-center sm:text-left">
                                        {paymentNo}
                                    </span>
                                    <button 
                                        onClick={handleCopy}
                                        className={`w-full sm:w-auto flex justify-center items-center gap-2 text-sm px-5 py-3 rounded-lg font-semibold transition-colors duration-200
                                            ${copied 
                                                ? 'bg-teal-500 text-white' 
                                                : 'bg-[#ED1C24] text-white hover:bg-red-700'
                                            }`}
                                    >
                                        {copied ? <Check size={18} /> : <Clipboard size={18} />}
                                        {copied ? 'Tersalin' : 'Salin VA'}
                                    </button>
                                </div>
                            </div>

                            {/* Waktu Kedaluwarsa */}
                            <div className="flex items-center justify-center gap-3 p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200">
                                <Clock3 size={20} className="flex-shrink-0" />
                                <p className="text-sm">
                                    Selesaikan pembayaran sebelum:<br/>
                                    <strong className="font-semibold text-base">{expiredAt}</strong>
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Area Instruksi Dinamis */}
                    <div className="mt-12 bg-white rounded-3xl shadow-md p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                                <Wallet size={24} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Cara Pembayaran {channel}</h3>
                        </div>

                        <div className="space-y-6">
                            {dynamicInstructions.map((inst, index) => (
                                <details key={index} className="group border-b border-gray-100 pb-5 last:border-b-0 last:pb-0" open={index === 0}>
                                    <summary className="flex justify-between items-center font-semibold text-base sm:text-lg text-gray-800 cursor-pointer list-none group-open:text-teal-700">
                                        {inst.label}
                                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <ol className="list-decimal list-outside pl-6 mt-4 space-y-2 text-gray-700 text-sm">
                                        {inst.steps.map((step, sIndex) => (
                                            <li key={sIndex}>
                                                {step.replace('{paymentNo}', paymentNo)}
                                            </li>
                                        ))}
                                    </ol>
                                </details>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}