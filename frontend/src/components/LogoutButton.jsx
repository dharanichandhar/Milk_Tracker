import '../styles/LogoutButton.css';

const LogoutButton = ({ onLogout }) => {
  return (
    <button className="button" onClick={onLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
