import { Link, useNavigate } from "react-router-dom";

const MyCard = ({style,  icon, title, description, link, buttonText }) => {
  const navigate = useNavigate();

  return (
    <div style={style} className="admin-card">
      <i className={`bx ${icon} admin-card-icon`}></i>
      <h3 className="admin-card-title">{title}</h3>
      <p className="admin-card-desc">{description}</p>
      <Link to={link}>
        <button className="admin-btn" onClick={() => navigate(link)}>
          <span>{buttonText}</span>
          <i className="bx bx-chevron-right"></i>
        </button>
      </Link>
    </div>
  );
};

export default MyCard;
