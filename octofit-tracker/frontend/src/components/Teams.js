import React, { useEffect, useState } from 'react';

const resource = 'teams';
const componentName = 'Teams';

const Teams = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h2 className="h4 mb-1">{componentName}</h2>
            <p className="mb-0 text-muted">Endpoint: <code>{endpoint}</code></p>
          </div>
        </div>
        <div className="card-body">
          {loading && <div className="alert alert-info">Loading {componentName}...</div>}
          {error && <div className="alert alert-danger">Error: {error}</div>}
          {!loading && !error && data.length === 0 && (
            <div className="alert alert-warning">No teams found.</div>
          )}
          {!loading && !error && data.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Team Name</th>
                    <th scope="col">Members</th>
                    <th scope="col">Created</th>
                    <th scope="col">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id ?? index}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.name || item.title || `Team ${index + 1}`}</td>
                      <td>{item.members?.length ?? item.member_count ?? 'N/A'}</td>
                      <td>{item.created_at || item.created || 'N/A'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          data-bs-toggle="modal"
                          data-bs-target="#teamDetailModal"
                          onClick={() => setSelectedItem(item)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="modal fade" id="teamDetailModal" tabIndex="-1" aria-labelledby="teamDetailModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-card">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="teamDetailModalLabel">
                {selectedItem ? selectedItem.name || selectedItem.title || 'Team Details' : 'Team Details'}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {selectedItem ? (
                <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
              ) : (
                <p>No team selected.</p>
              )}
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

export default Teams;
