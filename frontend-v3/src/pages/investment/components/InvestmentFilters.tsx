import { Filter, X, Eye } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { COLUMN_VISIBILITY_OPTIONS } from "../types";

// Define strict types for props
interface FilterStates {
    klaster: string;
    entitas: string;
    type: string;
    tahun: string;
    status: string;
    tglMulai: Set<string>;
    tglSelesai: Set<string>;
    kontrakAktif: Set<string>;
}

interface SetFilters {
    setKlaster: (val: string) => void;
    setEntitas: (val: string) => void;
    setType: (val: string) => void;
    setTahun: (val: string) => void;
    setStatus: (val: string) => void;
    setTglMulai: (val: Set<string>) => void;
    setTglSelesai: (val: Set<string>) => void;
    setKontrakAktif: (val: Set<string>) => void;
}

interface FilterOptions {
    klaster: string[];
    entitas: string[];
    types: string[];
    tahun: number[];
    status: string[];
    tglMulai: string[];
    tglSelesai: string[];
    kontrakAktif: string[];
}

interface InvestmentFiltersProps {
    filterStates: FilterStates;
    setFilters: SetFilters;
    filterOptions: FilterOptions;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    totalCount: number;
    filteredCount: number;
    columnVisibility: Record<string, boolean>;
    toggleColumnVisibility: (id: string) => void;
}

export function InvestmentFilters({
    filterStates,
    setFilters,
    filterOptions,
    clearFilters,
    hasActiveFilters,
    totalCount,
    filteredCount,
    columnVisibility,
    toggleColumnVisibility
}: InvestmentFiltersProps) {
    return (
        <div className="bg-slate-800 dark:bg-slate-900 p-4 space-y-3 -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 mb-4">
            {/* Filter Section */}
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg">
                <Filter className="h-4 w-4 text-slate-300" />
                <span className="text-sm font-medium text-slate-300">Filter:</span>

                <Select value={filterStates.klaster} onValueChange={setFilters.setKlaster}>
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Klaster/Regional" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Klaster</SelectItem>
                        {filterOptions.klaster.map((k) => (
                            <SelectItem key={k} value={k}>{k}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filterStates.entitas} onValueChange={setFilters.setEntitas}>
                    <SelectTrigger className="w-[160px] h-8 text-xs bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Entitas/Terminal" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Entitas</SelectItem>
                        {filterOptions.entitas.map((e) => (
                            <SelectItem key={e} value={e}>{e}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filterStates.type} onValueChange={setFilters.setType}>
                    <SelectTrigger className="w-[130px] h-8 text-xs bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Type Investasi" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Type</SelectItem>
                        {filterOptions.types.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filterStates.tahun} onValueChange={setFilters.setTahun}>
                    <SelectTrigger className="w-[120px] h-8 text-xs bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Tahun Usulan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Tahun</SelectItem>
                        {filterOptions.tahun.map((t) => (
                            <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filterStates.status} onValueChange={setFilters.setStatus}>
                    <SelectTrigger className="w-[150px] h-8 text-xs bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Status Investasi" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        {filterOptions.status.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <MultiSelectFilter
                    title="Tgl Mulai"
                    options={filterOptions.tglMulai}
                    selectedValues={filterStates.tglMulai}
                    onChange={setFilters.setTglMulai}
                    placeholder="Cari Tanggal..."
                />

                <MultiSelectFilter
                    title="Tgl Selesai"
                    options={filterOptions.tglSelesai}
                    selectedValues={filterStates.tglSelesai}
                    onChange={setFilters.setTglSelesai}
                    placeholder="Cari Tanggal..."
                />

                <MultiSelectFilter
                    title="Kontrak Aktif"
                    options={filterOptions.kontrakAktif}
                    selectedValues={filterStates.kontrakAktif}
                    onChange={setFilters.setKontrakAktif}
                    placeholder="Cari Status..."
                />

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 px-2 text-xs gap-1 text-slate-300 hover:text-white hover:bg-slate-600"
                    >
                        <X className="h-3 w-3" />
                        Clear
                    </Button>
                )}

                <span className="ml-auto text-xs text-slate-400">
                    {filteredCount} dari {totalCount} item
                </span>
            </div>

            {/* Column Visibility Section */}
            <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-slate-700/50 rounded-lg">
                <Eye className="h-4 w-4 text-slate-300" />
                <span className="text-sm font-medium text-slate-300">Tampilkan Kolom:</span>

                {COLUMN_VISIBILITY_OPTIONS.map((option) => (
                    <div key={option.id} className="flex items-center gap-1.5">
                        <Checkbox
                            id={`col-${option.id}`}
                            checked={columnVisibility[option.id] !== false}
                            onCheckedChange={() => toggleColumnVisibility(option.id)}
                            className="border-slate-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <Label
                            htmlFor={`col-${option.id}`}
                            className="text-xs cursor-pointer text-slate-300"
                        >
                            {option.label}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
}
