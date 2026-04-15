import '../styles/SubscribeSection.css';

const SubscribeSection = ({ available, selectedVendor, setSelectedVendor, onSubscribe, loading }) => {
  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">Subscribe New Vendor</h3>
      </div>
      <div className="form-wrapper">
        <div className="select-group">
          <label className="select-label">Select a Vendor</label>
          <select
            className="form-select"
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
          >
            <option value="">-- Select Vendor --</option>
            {available.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <button 
          className="subscribe-btn" 
          onClick={() => onSubscribe(selectedVendor)} 
          disabled={loading}
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
    </div>
  );
};

export default SubscribeSection;
