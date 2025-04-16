const MyHeading = ({ subtext, heading }) => {

  return (
    <div className="admin-dashboard">
      <h1 className="admin-heading">{heading}</h1>
      <p className="admin-subtext">{subtext}</p>
    </div>
  );
};

export default MyHeading;
