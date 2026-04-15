import React from "react";
import VendorCard from "./VendorCard";
import '../styles/VendorList.css';

const VendorList = ({ vendors, onUnsubscribe }) => {
  if (vendors.length === 0) return <div className="empty-state">No subscriptions yet</div>;

  return (
    <div className="vendor-list">
      {vendors.map((v) => (
        <VendorCard
          key={v.id}
          vendor={v}
          onUnsubscribe={onUnsubscribe}
        />
      ))}
    </div>
  );
};

export default VendorList;
