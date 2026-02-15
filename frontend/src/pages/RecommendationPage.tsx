import React, { useState } from 'react';
import { apiClient, RecommendationResponse } from '../api/client';

export const RecommendationPage: React.FC = () => {
    const [criteria, setCriteria] = useState({
        machine_id: "M001",
        material: "AL-6061",
        tool_diameter: 10.0
    });
    const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);

    const handleRecommend = async () => {
        try {
            const result = await apiClient.getRecommendation(criteria);
            setRecommendation(result);
        } catch (error) {
            console.error(error);
            alert("Failed to get recommendation");
        }
    };

    const inputStyle = { display: 'flex', flexDirection: 'column' as const, gap: '5px' };
    const labelStyle = { fontWeight: 'bold' as const, fontSize: '0.9rem' };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Get Recommendation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px' }}>
                <div style={inputStyle}>
                    <label style={labelStyle}>Machine ID</label>
                    <input placeholder="e.g. M001" value={criteria.machine_id} onChange={e => setCriteria({ ...criteria, machine_id: e.target.value })} />
                </div>
                <div style={inputStyle}>
                    <label style={labelStyle}>Material</label>
                    <input placeholder="e.g. AL-6061" value={criteria.material} onChange={e => setCriteria({ ...criteria, material: e.target.value })} />
                </div>
                <div style={inputStyle}>
                    <label style={labelStyle}>Tool Diameter (mm)</label>
                    <input type="number" placeholder="10.0" value={criteria.tool_diameter} onChange={e => setCriteria({ ...criteria, tool_diameter: parseFloat(e.target.value) })} />
                </div>
                <button onClick={handleRecommend} style={{ marginTop: '10px' }}>Get Recommendation</button>
            </div>

            {recommendation && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Result</h3>
                    <p>Message: {recommendation.message}</p>
                    <p>Model Version: {recommendation.model_version}</p>
                    {recommendation.recommended_config && (
                        <pre>{JSON.stringify(recommendation.recommended_config, null, 2)}</pre>
                    )}
                </div>
            )}
        </div>
    );
};
