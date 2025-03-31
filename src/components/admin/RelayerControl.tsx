"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlayIcon, StopIcon, RefreshCwIcon, ServerIcon } from "lucide-react";

export function RelayerControl() {
    const [status, setStatus] = useState<{
        isRunning: boolean;
        status: string;
        startTime: string | null;
        uptime: number;
    }>({
        isRunning: false,
        status: "unknown",
        startTime: null,
        uptime: 0
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Format uptime to human-readable format
    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
    };

    // Fetch relayer status
    const fetchStatus = async () => {
        try {
            const response = await fetch("/api/relayer/status");
            if (!response.ok) throw new Error("Failed to fetch relayer status");

            const data = await response.json();
            setStatus(data);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching relayer status:", err);
            setError(err.message || "Failed to fetch relayer status");
        }
    };

    // Start the relayer
    const startRelayer = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/relayer/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to start relayer");
            }

            // Refresh status
            await fetchStatus();
        } catch (err: any) {
            console.error("Error starting relayer:", err);
            setError(err.message || "Failed to start relayer");
        } finally {
            setIsLoading(false);
        }
    };

    // Stop the relayer
    const stopRelayer = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/relayer/stop", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to stop relayer");
            }

            // Refresh status
            await fetchStatus();
        } catch (err: any) {
            console.error("Error stopping relayer:", err);
            setError(err.message || "Failed to stop relayer");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch status on load and periodically
    useEffect(() => {
        fetchStatus();

        // Poll for status updates every 30 seconds
        const interval = setInterval(fetchStatus, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ServerIcon className="h-5 w-5" />
                    Espresso Relayer Service
                </CardTitle>
                <CardDescription>
                    Monitor and manage the cross-chain relayer service
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Status:</span>
                        <Badge variant={status.isRunning ? "success" : "destructive"}>
                            {status.isRunning ? "Running" : "Stopped"}
                        </Badge>
                    </div>

                    {status.startTime && (
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Started:</span>
                            <span>{new Date(status.startTime).toLocaleString()}</span>
                        </div>
                    )}

                    {status.isRunning && (
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Uptime:</span>
                            <span>{formatUptime(status.uptime)}</span>
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchStatus}
                    disabled={isLoading}
                >
                    <RefreshCwIcon className="h-4 w-4 mr-2" />
                    Refresh
                </Button>

                <div className="flex gap-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={startRelayer}
                        disabled={isLoading || status.isRunning}
                    >
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Start Relayer
                    </Button>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={stopRelayer}
                        disabled={isLoading || !status.isRunning}
                    >
                        <StopIcon className="h-4 w-4 mr-2" />
                        Stop Relayer
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
} 