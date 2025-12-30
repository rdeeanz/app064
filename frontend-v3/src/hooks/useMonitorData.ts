import { useState, useEffect } from "react"
import { getMonitorInvestData, MonitorInvestData } from "@/lib/api"

export function useMonitorData() {
    const [data, setData] = useState<MonitorInvestData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await getMonitorInvestData()
            setData(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return { data, isLoading, error, refetch: fetchData }
}
