import { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonitorData {
    id_virtual: number;
    ref_id_root: string;
    original_id_investasi: string;
    entitas_terminal: string;
    project_definition: string;
    progres_description: string;
    issue_description: string;
    kebutuhan_dana: number;
    rkap: number;
    realisasi_sd_oktober: number; // Example, adjust based on actual columns needed
}

export default function MonitorInvest() {
    const [data, setData] = useState<MonitorData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8000/monitor/invest");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    if (loading) return <div className="p-8">Loading data...</div>;

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Monitor Investasi</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Data Investasi Terintegrasi</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">No</TableHead>
                                    <TableHead>ID Project</TableHead>
                                    <TableHead>Entitas</TableHead>
                                    <TableHead className="w-[300px]">Definisi Proyek</TableHead>
                                    <TableHead>Progres</TableHead>
                                    <TableHead className="text-right">Kebutuhan Dana</TableHead>
                                    <TableHead className="text-right">RKAP</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((item) => (
                                    <TableRow key={item.id_virtual}>
                                        <TableCell>{item.id_virtual}</TableCell>
                                        <TableCell className="font-medium">{item.original_id_investasi}</TableCell>
                                        <TableCell>{item.entitas_terminal}</TableCell>
                                        <TableCell>{item.project_definition}</TableCell>
                                        <TableCell className="whitespace-pre-line text-xs">{item.progres_description}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.kebutuhan_dana)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.rkap)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
