import '../styles/CustomerList.css';

const CustomerList = ({ customers }) => {
  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">Subscribed Customers</h3>
      </div>
      
      {customers.length === 0 ? (
        <div className="empty-state">No customers yet</div>
      ) : (
        <div className="customer-grid">
          {customers.map((c) => (
            <div key={c.id} className="customer-card">
              <div className="customer-info">
                <span className="customer-name">{c.name}</span>
                <span className="customer-id">ID: {c.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
