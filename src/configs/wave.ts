import dotenv from "dotenv"

dotenv.config();

export const waveConfig = {
    baseUrl: process.env.WAVE_BASE_URL ?? ''
}

// 