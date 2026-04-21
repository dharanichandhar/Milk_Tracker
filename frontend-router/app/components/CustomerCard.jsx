const CustomerCard = ({ customer }) => {
    return (
        <div className="customer-card">
            <h3>{customer.name}</h3>
            <p>Customer ID: #{customer.id}</p>
        </div>
    );
};

export default CustomerCard;
