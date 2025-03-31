import { NextRequest, NextResponse } from "next/server";

// Reference the same state from other routes
declare const relayerState: {
    isRunning: boolean;
    startTime: string | null;
    status: string;
};

export async function GET(req: NextRequest) {
    try {
        // Return current status
        return NextResponse.json({
            success: true,
            isRunning: relayerState.isRunning,
            status: relayerState.status,
            startTime: relayerState.startTime,
            uptime: relayerState.startTime
                ? Math.floor((Date.now() - new Date(relayerState.startTime).getTime()) / 1000)
                : 0
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to get relayer status",
                error: error.message
            },
            { status: 500 }
        );
    }
} 