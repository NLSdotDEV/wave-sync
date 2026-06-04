import { waveConfig } from "../configs/wave.js";
import { Buffer } from "buffer";

interface GraphQlResponse {
  data?: any | null;
  errors?: unknown | null;
}
export class WaveGraphQlClient {
  async request(
    token: string,
    payload: Record<string, any>,
  ): Promise<GraphQlResponse> {
    const headers = new Headers();
    headers.set("Authorization", this.encodeToken(token));
    headers.set("Content-Type", "application/json");

    const request = await fetch(waveConfig.baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!request.ok) {
      throw new Error(
        `Wave API Error: Request failed with status ${request.status} - ${request.statusText}`,
      );
    }

    const response: GraphQlResponse = await request.json();

    if (!response.data || response.data == null) {
      throw new Error("Data not found in request " + JSON.stringify(response));
    }

    if (response.errors) {
      throw new Error("error occured during request");
    }

    return response;
  }

  private encodeToken(token: string): string {
    const formattedHeader = `:${token}`;
    const encodedToken = Buffer.from(formattedHeader, "utf8").toString(
      "base64",
    );

    return `Basic ${encodedToken}`;
  }
}
