import { useState, useEffect } from 'react';
import TableGrid from './components/TableGrid';

function App() {
  const [userProgress, setUserProgress] = useState({});
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [manualJson, setManualJson] = useState('');
  const [uiStyle, setUiStyle] = useState('classic'); // 'classic', 'border', 'opacity'

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('leetcode-progress');
    if (saved) {
      try {
        setUserProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved progress");
      }
    }

    // Listen for messages from the Chrome Extension
    const handleMessage = (event) => {
      // Allow messages from same window/extension
      if (event.data && event.data.type === 'LEETCODE_SYNC_DATA') {
        const payload = event.data.payload; // Should be object { [titleSlug]: 'solved' | 'attempted' }
        setUserProgress(payload);
        localStorage.setItem('leetcode-progress', JSON.stringify(payload));
        alert('Sync successful!');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleManualSync = () => {
    try {
      const parsed = JSON.parse(manualJson);
      setUserProgress(parsed);
      localStorage.setItem('leetcode-progress', JSON.stringify(parsed));
      setShowSyncModal(false);
      setManualJson('');
    } catch (e) {
      alert("Invalid JSON format. Please check your data.");
    }
  };

  return (
    <>
      <header>
        <h1>LeetCode Problems</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <select 
            value={uiStyle} 
            onChange={e => setUiStyle(e.target.value)}
            style={{ background: 'transparent', color: '#ccc', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}
          >
            <option value="classic">Classic Backgrounds</option>
            <option value="border">Glowing Borders</option>
            <option value="opacity">Opacity Fading</option>
          </select>
          <button className="sync-btn" onClick={() => setShowSyncModal(true)}>
            Sync Progress
          </button>
        </div>
      </header>

      <div className="legend">
        <div className="legend-chip"><span className="diff-icon legend-icon" style={{borderColor: 'var(--rating-gray)', background: 'var(--rating-gray)'}}></span> &lt; 1200</div>
        <div className="legend-chip"><span className="diff-icon legend-icon" style={{borderColor: 'var(--rating-brown)', background: 'var(--rating-brown)'}}></span> 1200 - 1399</div>
        <div className="legend-chip"><span className="diff-icon legend-icon" style={{borderColor: 'var(--rating-green)', background: 'var(--rating-green)'}}></span> 1400 - 1599</div>
        <div className="legend-chip"><span className="diff-icon legend-icon" style={{borderColor: 'var(--rating-cyan)', background: 'var(--rating-cyan)'}}></span> 1600 - 1999</div>
        <div className="legend-chip"><span className="diff-icon legend-icon" style={{borderColor: 'var(--rating-blue)', background: 'var(--rating-blue)'}}></span> 2000 - 2399</div>
        <div className="legend-chip"><span className="diff-icon legend-icon" style={{borderColor: 'var(--rating-yellow)', background: 'var(--rating-yellow)'}}></span> 2400 - 2799</div>
        <div className="legend-chip"><span className="diff-icon legend-icon" style={{borderColor: 'var(--rating-orange)', background: 'var(--rating-orange)'}}></span> 2800 - 2999</div>
        <div className="legend-chip"><span className="diff-icon legend-icon" style={{borderColor: 'var(--rating-red)', background: 'var(--rating-red)'}}></span> &ge; 3000</div>
      </div>

      <main className={`view-${uiStyle}`}>
        <TableGrid userProgress={userProgress} />
      </main>

      {showSyncModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sync Your Progress</h2>
            <p>
              To sync your solved problems, use the <b>LeetCode Kenkoooo Extension</b>. 
              Install it, log into LeetCode, and click the extension icon to automatically push your data here.
            </p>
            <p style={{ fontSize: '0.9em', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              Alternatively, for manual testing, paste your progress JSON below:
            </p>
            <textarea 
              placeholder='{"two-sum": "solved", "add-two-numbers": "attempted"}'
              value={manualJson}
              onChange={(e) => setManualJson(e.target.value)}
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowSyncModal(false)}>Cancel</button>
              <button className="sync-btn" onClick={handleManualSync}>Manual Update</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
