import {
    Loader2,
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvestmentTable } from "./investment/hooks/useInvestmentTable";
import { useInvestmentDetails } from "./investment/hooks/useInvestmentDetails";
import { InvestmentFilters } from "./investment/components/InvestmentFilters";
import { InvestmentTable } from "./investment/components/InvestmentTable";

export default function InvestmentProject() {
    // Hooks
    const {
        data,
        filteredData,
        isLoading,
        error,
        refetch,
        // Filters
        filterStates,
        setFilters,
        filterOptions,
        clearFilters,
        hasActiveFilters,
        // Sort
        sortColumn,
        sortDirection,
        handleSort,
        // Resize & Visibility
        columnWidths,
        columnVisibility,
        toggleColumnVisibility,
        handleResizeStart
    } = useInvestmentTable();

    const {
        expandedRows,
        toggleExpand,
        loadingDetails,
        detailData
    } = useInvestmentDetails();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-destructive font-medium">Error: {error}</p>
                <Button onClick={refetch} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Coba Lagi
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <InvestmentFilters
                filterStates={filterStates}
                setFilters={setFilters}
                filterOptions={filterOptions}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                totalCount={data.length}
                filteredCount={filteredData.length}
                columnVisibility={columnVisibility}
                toggleColumnVisibility={toggleColumnVisibility}
            />

            <InvestmentTable
                filteredData={filteredData}
                columnVisibility={columnVisibility}
                columnWidths={columnWidths}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                handleSort={handleSort}
                handleResizeStart={handleResizeStart}
                expandedRows={expandedRows}
                toggleExpand={toggleExpand}
                loadingDetails={loadingDetails}
                detailData={detailData}
                filterStates={filterStates}
            />
        </div>
    );
}
