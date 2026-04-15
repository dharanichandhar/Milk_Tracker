import VendorList from "./VendorList";
import '../styles/SubscribedVendors.css';

const SubscribedVendors = ({ vendors, onUnsubscribe }) => {
  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">Subscribed Vendors</h3>
      </div>
      {vendors.length === 0 ? (
        <div className="empty-state">No subscriptions yet</div>
      ) : (
        <VendorList vendors={vendors} onUnsubscribe={onUnsubscribe} />
      )}
    </div>
  );
};

export default SubscribedVendors;
