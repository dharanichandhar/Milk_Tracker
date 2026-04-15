import '../styles/VendorInfo.css';

const VendorInfo = ({ vendorId }) => {
  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">Vendor Information</h3>
      </div>
      <div className="vendor-info-card">
        <div className="info-row">
          <span className="info-label">Vendor ID:</span>
          <span className="info-value">{vendorId}</span>
        </div>
      </div>
    </div>
  );
};

export default VendorInfo;
