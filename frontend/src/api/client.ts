export const API_BASE_URL = "http://localhost:8000";

export interface Configuration {
    id?: string;
    machine_id: string;
    material: string;
    tool_diameter: number;
    feed_rate: number;
    spindle_speed: number;
    created_at?: string;
    version?: number;
}

export interface ValidationResult {
    config_id: string;
    is_valid: boolean;
    warnings: string[];
    validation_hash: string;
}

export interface RecommendationRequest {
    machine_id: string;
    material: string;
    tool_diameter: number;
}

export interface RecommendationResponse {
    recommended_config: Configuration | null;
    model_version: string;
    message: string;
}

export const apiClient = {
    async createConfig(config: Configuration): Promise<Configuration> {
        const response = await fetch(`${API_BASE_URL}/config/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config),
        });
        if (!response.ok) throw new Error("Failed to create config");
        return response.json();
    },

    async validateConfig(configId: string): Promise<ValidationResult> {
        const response = await fetch(`${API_BASE_URL}/validate/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ config_id: configId }),
        });
        if (!response.ok) throw new Error("Failed to validate config");
        return response.json();
    },

    async getRecommendation(req: RecommendationRequest): Promise<RecommendationResponse> {
        const response = await fetch(`${API_BASE_URL}/recommend/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req),
        });
        if (!response.ok) throw new Error("Failed to get recommendation");
        return response.json();
    }
};
