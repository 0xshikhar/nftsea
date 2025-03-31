import { NextRequest, NextResponse } from "next/server";
import { startRelayerService } from "@/relayer/service";

// Store the service state
let relayerState = {
    isRunning: false,
    startTime: null,
    status: "stopped"
};

export async function POST(req: NextRequest) {
    try {
        // Check if already running
        if (relayerState.isRunning) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Relayer is already running",
                    status: relayerState.status,
                    startTime: relayerState.startTime
                },
                { status: 400 }
            );
        }

        // Optional authentication check here
        // const authHeader = req.headers.get("authorization");
        // if (!authHeader || !validateAuth(authHeader)) {
        //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        // }

        const result = await startRelayerService();

        // Update state
        relayerState = {
            isRunning: true,
            startTime: new Date().toISOString(),
            status: "running"
        };

        return NextResponse.json({
            success: true,
            message: "Relayer service started successfully",
            ...result
        });
    } catch (error: any) {
        console.error("Failed to start relayer:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to start relayer service",
                error: error.message
            },
            { status: 500 }
        );
    }
} 