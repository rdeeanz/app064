import { useState } from "react";
import { ProjectData, getProjectsByInvestasi } from "@/lib/api";

export function useInvestmentDetails() {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [detailData, setDetailData] = useState<Record<string, ProjectData[]>>({});
    const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());

    const toggleExpand = async (idInvestasi: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(idInvestasi)) {
            newExpanded.delete(idInvestasi);
        } else {
            newExpanded.add(idInvestasi);
            // Fetch data if not already present
            if (!detailData[idInvestasi]) {
                setLoadingDetails(prev => new Set(prev).add(idInvestasi));
                try {
                    const projects = await getProjectsByInvestasi(idInvestasi);
                    setDetailData(prev => ({
                        ...prev,
                        [idInvestasi]: projects
                    }));
                } catch (error) {
                    console.error("Failed to fetch project details:", error);
                } finally {
                    setLoadingDetails(prev => {
                        const next = new Set(prev);
                        next.delete(idInvestasi);
                        return next;
                    });
                }
            }
        }
        setExpandedRows(newExpanded);
    };

    return {
        expandedRows,
        detailData,
        loadingDetails,
        toggleExpand
    };
}
