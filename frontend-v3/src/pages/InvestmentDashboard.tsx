

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts';

// --- Mock Data & Constants ---
const GAUGE_VALUE = 36.10;
const RKAP_2025_TRF_ANG = "Rp 491,34 M";
const REAL_SD_OKT_25 = "Rp 177,35 M";

const STATUS_PROGRAM_DATA = [
    { name: 'PERSIAPAN', count: 7, fill: '#3b4d61' },
    { name: 'PERIZINAN', count: 12, fill: '#3b4d61' },
    { name: 'PERENCANAAN', count: 14, fill: '#3b4d61' },
    { name: 'PERENC. SELESAI/ANTRIAN PENGADAAN', count: 3, fill: '#3b4d61' },
    { name: 'LELANG PENYEDIA JASA', count: 12, fill: '#3b4d61' },
    { name: 'PELAKSANAAN FISIK', count: 23, fill: '#3b4d61' },
    { name: 'MASA PEMELIHARAAN', count: 7, fill: '#3b4d61' },
    { name: 'SELESAI', count: 11, fill: '#3b4d61' },
];

const INVESTMENT_DATA = [
    { no: 1, nama: "Bangunan Fasilitas", kebutuhan: 1421.09, rkap_awal: 277.33, rkap_transfer: 424.05, okt_rkap: 39.99, okt_real: 30.71, sd_okt_rkap: 328.13, sd_okt_real: 149.33, taksasi: 235.81, capaian_9: 76.79, capaian_10: 45.51, capaian_11: 35.22, capaian_12: 55.61 },
    { no: 2, nama: "Kapal", kebutuhan: 8.25, rkap_awal: 4.00, rkap_transfer: 4.00, okt_rkap: 0.45, okt_real: null, sd_okt_rkap: 1.70, sd_okt_real: 0.51, taksasi: 0.55, capaian_9: null, capaian_10: 30.00, capaian_11: 12.75, capaian_12: 13.75 },
    { no: 3, nama: "Alat-Alat Fasilitas", kebutuhan: 14.50, rkap_awal: 6.31, rkap_transfer: 5.75, okt_rkap: 0.50, okt_real: null, sd_okt_rkap: 4.06, sd_okt_real: 3.27, taksasi: 3.27, capaian_9: null, capaian_10: 80.54, capaian_11: 56.87, capaian_12: 56.87 },
    { no: 4, nama: "Instalasi Fasilitas", kebutuhan: 19.80, rkap_awal: 10.05, rkap_transfer: 10.61, okt_rkap: 1.23, okt_real: 0.30, sd_okt_rkap: 6.60, sd_okt_real: 2.64, taksasi: 4.84, capaian_9: 24.39, capaian_10: 40.00, capaian_11: 24.88, capaian_12: 45.62 },
    { no: 5, nama: "Tanah dan Hak atas Tanah", kebutuhan: 47.00, rkap_awal: 4.70, rkap_transfer: 8.23, okt_rkap: 1.10, okt_real: null, sd_okt_rkap: 7.73, sd_okt_real: 7.53, taksasi: 7.77, capaian_9: null, capaian_10: 97.41, capaian_11: 91.49, capaian_12: 94.41 },
    { no: 6, nama: "Jalan, Bangunan, Sarana dan Prasarana", kebutuhan: 311.25, rkap_awal: 28.73, rkap_transfer: 31.02, okt_rkap: 3.46, okt_real: 3.73, sd_okt_rkap: 21.93, sd_okt_real: 12.48, taksasi: 23.64, capaian_9: 107.80, capaian_10: 56.91, capaian_11: 40.23, capaian_12: 76.21 },
    { no: 7, nama: "Peralatan dan Perlengkapan", kebutuhan: 10.32, rkap_awal: 4.48, rkap_transfer: 4.49, okt_rkap: 0.69, okt_real: 1.53, sd_okt_rkap: 3.52, sd_okt_real: 1.53, taksasi: 4.18, capaian_9: 221.74, capaian_10: 43.47, capaian_11: 34.08, capaian_12: 93.10 },
    { no: 8, nama: "Kendaraan", kebutuhan: null, rkap_awal: null, rkap_transfer: null, okt_rkap: null, okt_real: null, sd_okt_rkap: null, sd_okt_real: null, taksasi: null, capaian_9: null, capaian_10: null, capaian_11: null, capaian_12: null },
    { no: 9, nama: "Emplasemen", kebutuhan: 16.26, rkap_awal: 3.10, rkap_transfer: 3.10, okt_rkap: 0.25, okt_real: null, sd_okt_rkap: 1.00, sd_okt_real: 0.06, taksasi: 0.17, capaian_9: null, capaian_10: 6.00, capaian_11: 1.94, capaian_12: 5.48 },
    { no: 10, nama: "Investasi Non Fisik", kebutuhan: 29.74, rkap_awal: 0.10, rkap_transfer: 0.10, okt_rkap: null, okt_real: null, sd_okt_rkap: null, sd_okt_real: null, taksasi: null, capaian_9: null, capaian_10: null, capaian_11: null, capaian_12: null },
    { no: 11, nama: "Kapitalisasi Bunga", kebutuhan: null, rkap_awal: null, rkap_transfer: null, okt_rkap: null, okt_real: null, sd_okt_rkap: null, sd_okt_real: null, taksasi: null, capaian_9: null, capaian_10: null, capaian_11: null, capaian_12: null },
];

// --- Components ---

const GaugeChart = () => {
    const data = [
        { name: 'Progress', value: GAUGE_VALUE, color: '#0057ae' },
        { name: 'Remaining', value: 100 - GAUGE_VALUE, color: '#e5e7eb' },
    ];
    return (
        <div className="relative h-[140px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="80%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-3xl font-bold text-[#0057ae]">{GAUGE_VALUE.toLocaleString('id-ID')}%</div>
            </div>
        </div>
    );
};

const StatusBarChart = () => {
    return (
        <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={STATUS_PROGRAM_DATA}
                    margin={{ top: 0, right: 25, left: 0, bottom: 0 }}
                >
                    <XAxis type="number" hide />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        tick={{ fontSize: 8, fill: '#333' }}
                        interval={0}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="count" fill="#3b4d61" barSize={14} radius={[0, 3, 3, 0]}>
                        <LabelList dataKey="count" position="right" fontSize={9} fontWeight="bold" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const formatNumber = (val: number | null) => {
    if (val === null || val === undefined) return '-';
    return val.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// --- Main Page Component ---
export default function InvestmentDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 p-2 space-y-2">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                {/* Logo */}
                <div className="flex items-center gap-1 shrink-0">
                    <div className="text-xl font-bold text-[#0057ae] italic flex items-center gap-1">
                        <svg viewBox="0 0 32 32" className="w-8 h-8">
                            <circle cx="16" cy="16" r="14" fill="#0057ae" />
                            <path d="M8 16 C8 12, 12 8, 16 8 C20 8, 24 12, 24 16" stroke="white" strokeWidth="3" fill="none" />
                        </svg>
                        <span className="text-lg">PELINDO</span>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center flex-1">
                    <h1 className="text-xl font-bold text-[#003399]">INVESTMENT DASHBOARD REGIONAL 2</h1>
                    <h2 className="text-lg font-bold text-[#003399]">RKAP TAHUN 2025</h2>
                </div>

                {/* Year/Month Filters */}
                <div className="flex flex-col gap-1 shrink-0">
                    <div className="flex gap-1 items-center">
                        <span className="text-[10px] font-bold w-10">Year</span>
                        <div className="text-[10px] px-1.5 py-0.5 bg-gray-200 rounded">2022</div>
                        <div className="text-[10px] px-1.5 py-0.5 bg-gray-200 rounded">2024</div>
                        <span className="text-[10px] font-bold w-10 ml-2">Month</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <span className="text-[10px] w-10"></span>
                        <div className="text-[10px] px-1.5 py-0.5 bg-gray-200 rounded">2023</div>
                        <div className="text-[10px] px-1.5 py-0.5 bg-white border border-gray-400 rounded font-bold shadow-sm">2025</div>
                    </div>
                    <div className="grid grid-cols-6 gap-0.5 text-[9px] mt-1">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
                            <div key={m} className="px-1 py-0.5 bg-gray-200 rounded text-center">{m}</div>
                        ))}
                        {['Jul', 'Aug', 'Okt', 'Oct', 'Nov', 'Dec'].map((m) => (
                            <div key={m} className={`px-1 py-0.5 rounded text-center ${m === 'Okt' ? 'bg-red-100 border border-red-400 font-bold underline' : 'bg-gray-200'}`}>{m}</div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
                {/* LEFT COLUMN */}
                <div className="col-span-3 space-y-2">
                    {/* Gauge Card */}
                    <Card className="rounded-sm border shadow-sm">
                        <CardHeader className="bg-[#007cc2] py-1.5 text-center rounded-t-sm">
                            <CardTitle className="text-white text-sm font-medium">REGIONAL 2</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2 pb-2 px-2">
                            <GaugeChart />
                            <div className="flex justify-between mt-2 text-[10px] font-semibold px-1">
                                <div className="text-center">
                                    <div>RKAP 2025-Trf Ang</div>
                                    <div>{RKAP_2025_TRF_ANG}</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-1">
                                        Real. <span className="text-red-600 underline">s.d Okt</span> '25
                                    </div>
                                    <div>{REAL_SD_OKT_25}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Program Card */}
                    <Card className="rounded-sm border shadow-sm">
                        <CardHeader className="bg-[#007cc2] py-1.5 text-center rounded-t-sm">
                            <CardTitle className="text-white text-sm font-medium">STATUS PROGRAM</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2 pb-2 px-2 flex flex-col items-center">
                            <div className="text-2xl font-light mb-2 bg-gray-100 w-full text-center py-1.5">89 Item</div>
                            <StatusBarChart />
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN (Table) */}
                <div className="col-span-9">
                    <div className="flex justify-end mb-0.5">
                        <span className="text-[10px] font-bold italic">Dalam Jutaan Rupiah</span>
                    </div>
                    <div className="border bg-white overflow-x-auto">
                        <table className="w-full border-collapse text-[10px]">
                            <thead className="bg-[#1f2937] text-white text-center">
                                <tr>
                                    <th rowSpan={2} className="border border-slate-500 px-1 py-0.5 w-8">NO</th>
                                    <th rowSpan={2} className="border border-slate-500 px-1 py-0.5 min-w-[140px]">NAMA AKTIVA</th>
                                    <th rowSpan={2} className="border border-slate-500 px-1 py-0.5 w-16">KEBUTUHAN<br />DANA *)</th>
                                    <th rowSpan={2} className="border border-slate-500 px-1 py-0.5 w-14">RKAP AWAL<br />TAHUN 2025</th>
                                    <th rowSpan={2} className="border border-slate-500 px-1 py-0.5 w-16">RKAP-Transfer<br />Anggaran **)<br />TAHUN 2025</th>
                                    <th colSpan={2} className="border border-slate-500 px-1 py-0.5 text-[#ffcccc] font-bold underline">Okt</th>
                                    <th colSpan={2} className="border border-slate-500 px-1 py-0.5 text-[#ffcccc] font-bold underline">s.d Okt</th>
                                    <th rowSpan={2} className="border border-slate-500 px-1 py-0.5 w-14">TAKSASI<br />RKAP<br />TAHUN 2025</th>
                                    <th colSpan={4} className="border border-slate-500 px-1 py-0.5">CAPAIAN (%)</th>
                                </tr>
                                <tr>
                                    <th className="border border-slate-500 px-0.5 py-0.5 w-10">RKAP</th>
                                    <th className="border border-slate-500 px-0.5 py-0.5 w-12">REALISASI</th>
                                    <th className="border border-slate-500 px-0.5 py-0.5 w-12">RKAP</th>
                                    <th className="border border-slate-500 px-0.5 py-0.5 w-14">REALISASI</th>
                                    <th className="border border-slate-500 px-0.5 py-0.5 w-10">9=5:4</th>
                                    <th className="border border-slate-500 px-0.5 py-0.5 w-10">10=7:6</th>
                                    <th className="border border-slate-500 px-0.5 py-0.5 w-10">11=7:3</th>
                                    <th className="border border-slate-500 px-0.5 py-0.5 w-10">12=8:3</th>
                                </tr>
                                <tr className="bg-[#cfd5ea] text-black text-[9px]">
                                    <th className="border border-slate-400 py-0.5"></th>
                                    <th className="border border-slate-400 py-0.5 text-left pl-1">1</th>
                                    <th className="border border-slate-400 py-0.5">2</th>
                                    <th className="border border-slate-400 py-0.5">3</th>
                                    <th className="border border-slate-400 py-0.5"></th>
                                    <th className="border border-slate-400 py-0.5">4</th>
                                    <th className="border border-slate-400 py-0.5">5</th>
                                    <th className="border border-slate-400 py-0.5">6</th>
                                    <th className="border border-slate-400 py-0.5">7</th>
                                    <th className="border border-slate-400 py-0.5">8</th>
                                    <th className="border border-slate-400 py-0.5"></th>
                                    <th className="border border-slate-400 py-0.5"></th>
                                    <th className="border border-slate-400 py-0.5"></th>
                                    <th className="border border-slate-400 py-0.5"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {INVESTMENT_DATA.map((row) => (
                                    <tr key={row.no} className="hover:bg-slate-100">
                                        <td className="border border-slate-300 px-1 py-0.5 text-center bg-[#eaeff7]">{row.no}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 bg-[#eaeff7] text-[#c00000] underline decoration-dotted text-[9px]">{row.nama}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-right bg-[#eaeff7]">{formatNumber(row.kebutuhan)}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-right text-gray-500">{formatNumber(row.rkap_awal)}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-right font-medium bg-[#eaeff7]">{formatNumber(row.rkap_transfer)}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-right">{formatNumber(row.okt_rkap)}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-right">{formatNumber(row.okt_real)}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-right bg-[#eaeff7]">{formatNumber(row.sd_okt_rkap)}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-right bg-[#eaeff7]">{formatNumber(row.sd_okt_real)}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-right bg-[#eaeff7]">{formatNumber(row.taksasi)}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-center bg-[#eaeff7]">{formatNumber(row.capaian_9)}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-center bg-[#eaeff7]">{formatNumber(row.capaian_10)}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-center bg-[#eaeff7]">{formatNumber(row.capaian_11)}</td>
                                        <td className="border border-slate-300 px-1 py-0.5 text-center bg-[#eaeff7]">{formatNumber(row.capaian_12)}</td>
                                    </tr>
                                ))}
                                {/* Total Row */}
                                <tr className="bg-[#1f2937] text-white font-bold">
                                    <td colSpan={2} className="border border-slate-500 px-1 py-1 text-center">TOTAL INVESTASI</td>
                                    <td className="border border-slate-500 px-1 py-1 text-right">1.878,22</td>
                                    <td className="border border-slate-500 px-1 py-1 text-right">338,81</td>
                                    <td className="border border-slate-500 px-1 py-1 text-right">491,34</td>
                                    <td className="border border-slate-500 px-1 py-1 text-right">47,61</td>
                                    <td className="border border-slate-500 px-1 py-1 text-right">36,27</td>
                                    <td className="border border-slate-500 px-1 py-1 text-right">374,67</td>
                                    <td className="border border-slate-500 px-1 py-1 text-right">177,35</td>
                                    <td className="border border-slate-500 px-1 py-1 text-right">280,17</td>
                                    <td className="border border-slate-500 px-1 py-1 text-center">76,09</td>
                                    <td className="border border-slate-500 px-1 py-1 text-center">47,33</td>
                                    <td className="border border-slate-500 px-1 py-1 text-center">36,10</td>
                                    <td className="border border-slate-500 px-1 py-1 text-center">57,01</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Notes */}
                    <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-[10px] space-y-1">
                        <h3 className="font-bold underline italic text-red-700">Keterangan / Dasar:</h3>
                        <p>
                            *) <span className="italic">Berita Acara Nomor: KU.01.05/5/5/1/MVIN/STRG/PLND-25 <span className="text-red-600 underline">tanggal 5 Agust 2025</span> tentang <span className="text-red-600 underline">Persetujuan</span> Transfer <span className="text-red-600 underline">Anggaran Investasi</span> RKAP tahun 2025 Kantor Pusat dan Regional 2</span>
                        </p>
                        <p>
                            **) <span className="italic">Berita Acara Nomor: KU.01.05/2/7/1/PRIV/STRG/PLND-25 <span className="text-red-600 underline">tanggal 2 Agust 2025</span> tentang Persetujuan Transfer <span className="text-red-600 underline">Anggaran Investasi</span> RKAP tahun 2025 Regional 2</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
