import React from "react";
import '../styles/SubscribeForm.css';

const SubscribeForm = ({ available, selectedVendor, setSelectedVendor, onSubscribe, loading }) => {
  return (
    <div className="form-container">
      <select
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

      <button onClick={() => onSubscribe(selectedVendor)} disabled={loading} className="button">
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </div>
  );
};

export default SubscribeForm;
