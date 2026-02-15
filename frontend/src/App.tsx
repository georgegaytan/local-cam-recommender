import React, { useState } from 'react';
import { ConfigPage } from './pages/ConfigPage';
import { RecommendationPage } from './pages/RecommendationPage';
import { ValidationPage } from './pages/ValidationPage';

function App() {
    const [page, setPage] = useState<'config' | 'recommend' | 'validate'>('config');

    return (
        <div className="App">
            <header style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', gap: '20px' }}>
                <h1>Local CAM Recommender</h1>
                <nav style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={() => setPage('config')}>Config</button>
                    <button onClick={() => setPage('recommend')}>Reasoning/Recommend</button>
                    <button onClick={() => setPage('validate')}>Validate</button>
                </nav>
            </header>
            <main>
                {page === 'config' && <ConfigPage />}
                {page === 'recommend' && <RecommendationPage />}
                {page === 'validate' && <ValidationPage />}
            </main>
        </div>
    );
}

export default App;
