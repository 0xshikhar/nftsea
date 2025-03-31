import { NextRequest, NextResponse } from "next/server";
import { stopRelayerService } from "@/relayer/service";

// Reference the same state from the start route
declare const relayerState: {
    isRunning: boolean;
    startTime: string | null;
    status: string;
};

export async function POST(req: NextRequest) {
    try {
        // Check if already stopped
        if (!relayerState.isRunning) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Relayer is not running"
                },
                { status: 400 }
            );
        }

        // Optional authentication check here
        // const authHeader = req.headers.get("authorization");
        // if (!authHeader || !validateAuth(authHeader)) {
        //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        // }

        const result = await stopRelayerService();

        // Update state
        Object.assign(relayerState, {
            isRunning: false,
            startTime: null,
            status: "stopped"
        });

        return NextResponse.json({
            success: true,
            message: "Relayer service stopped successfully",
            ...result
        });
    } catch (error: any) {
        console.error("Failed to stop relayer:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to stop relayer service",
                error: error.message
            },
            { status: 500 }
        );
    }
} 