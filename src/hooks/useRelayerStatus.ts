import { useState, useEffect } from "react";

type RelayerStatus = {
    isRunning: boolean;
    status: string;
    startTime: string | null;
    uptime: number;
    isLoading: boolean;
    error: string | null;
};

export function useRelayerStatus(pollingInterval = 30000) {
    const [status, setStatus] = useState<Omit<RelayerStatus, "isLoading" | "error">>({
        isRunning: false,
        status: "unknown",
        startTime: null,
        uptime: 0
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/relayer/status");

            if (!response.ok) {
                throw new Error("Failed to fetch relayer status");
            }

            const data = await response.json();
            setStatus(data);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching relayer status:", err);
            setError(err.message || "Failed to fetch relayer status");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();

        // Set up polling if an interval is specified
        if (pollingInterval > 0) {
            const interval = setInterval(fetchStatus, pollingInterval);
            return () => clearInterval(interval);
        }
    }, [pollingInterval]);

    return {
        ...status,
        isLoading,
        error,
        refreshStatus: fetchStatus
    };
} 