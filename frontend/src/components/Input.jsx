import '../styles/Input.css';

const Input = ({ label, ...props }) => {
  return (
    <div className="input-wrapper">
      {label && <label>{label}</label>}
      <input {...props} />
    </div>
  );
};

export default Input;
