import React, { useEffect, useState } from 'react';

const resource = 'leaderboard';
const componentName = 'Leaderboard';

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/${resource}/`;

  useEffect(() => {
    const fetchData = async () => {
      console.log(`Fetching ${componentName} from`, endpoint);
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`API returned ${response.status} ${response.statusText}`);
        }
        const json = await response.json();
        console.log(`${componentName} API response`, json);
        const payload = json?.results ?? json;
        const items = Array.isArray(payload) ? payload : payload ? [payload] : [];
        setData(items);
      } catch (fetchError) {
        console.error(`${componentName} fetch error`, fetchError);
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  const filteredData = data.filter((item) => {
    const text = JSON.stringify(item).toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h2 className="h4 mb-1">{componentName}</h2>
            <p className="mb-0 text-muted">Endpoint: <code>{endpoint}</code></p>
          </div>
          <form className="w-100 w-md-50" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <span className="input-group-text">Search</span>
              <input
                type="search"
                className="form-control"
                placeholder="Filter leaderboard"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="card-body">
          {loading && <div className="alert alert-info">Loading {componentName}...</div>}
          {error && <div className="alert alert-danger">Error: {error}</div>}
          {!loading && !error && filteredData.length === 0 && (
            <div className="alert alert-warning">No matching leaderboard entries found.</div>
          )}
          {!loading && !error && filteredData.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Name</th>
                    <th scope="col">Score</th>
                    <th scope="col">Team</th>
                    <th scope="col">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => {
                    const rank = item.rank ?? index + 1;
                    return (
                      <tr key={item.id ?? index}>
                        <th scope="row">{rank}</th>
                        <td>{item.name || item.username || item.title || 'Unknown'}</td>
                        <td>{item.score ?? item.points ?? 'N/A'}</td>
                        <td>{item.team || item.group || 'N/A'}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#leaderboardDetailModal"
                            onClick={() => setSelectedItem(item)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="modal fade" id="leaderboardDetailModal" tabIndex="-1" aria-labelledby="leaderboardDetailModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-card">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="leaderboardDetailModalLabel">
                {selectedItem ? selectedItem.name || selectedItem.username || 'Entry Details' : 'Entry Details'}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {selectedItem ? <pre>{JSON.stringify(selectedItem, null, 2)}</pre> : <p>No entry selected.</p>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
