import React from "react";
import '../styles/VendorCard.css';

const VendorCard = ({ vendor, onUnsubscribe }) => {
  return (
    <div className="vendor-card">
      <div className="vendor-info">
        <img
          src={vendor.image_url || "/vendor.png"}
          alt={vendor.name}
          className="vendor-image"
        />

        <div className="vendor-details">
          <span className="vendor-name">{vendor.name}</span>
        </div>
      </div>

      {onUnsubscribe && (
        <button
          onClick={() => onUnsubscribe(vendor.id)}
          className="unsubscribe-btn"
        >
          Unsubscribe
        </button>
      )}
    </div>
  );
};

export default VendorCard;
