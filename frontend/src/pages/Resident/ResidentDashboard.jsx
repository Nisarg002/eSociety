import React, { useEffect, useState } from "react";
import MyHeading from "../../components/common/MyHeading";
import MyCard from "../../components/common/MyCard";
import axios from "axios";

export const ResidentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user_id = localStorage.getItem("id");
        const response = await axios.get(`/user_id/${user_id}`);

        // Check if any fields are null (excluding _id)
        // console.log(response.data);
        response.data.society = response.data.society.name;
        const data = response.data;
        // console.log(data);
        const hasNullFields = Object.entries(data).some(([key, value]) => {
          // Skip the _id field check
          if (key === "_id") return false;
          // Check if the value is null
          return value === null;
        });
        // Set userData to null if any required fields are null
        setUserData(hasNullFields ? null : data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null); // Ensure it's null if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  return (
    <>
      <MyHeading
        heading={`Welcome Back, ${localStorage.getItem("username")}`}
        subtext="Access all your community services and manage your smart society experience."
      />

      <div className="admin-cards">
        {!isLoading &&
          (userData === null ? (
            
            <MyCard
             style={{
                border: "2px solid #64ffda",
                boxShadow: "0 0 15px #64ffda, 0 0 30px #64ffda",
              }}
              
              icon="bxs-user-detail"
              title="Complete Your Profile"
              description="Your profile is incomplete. Please update your personal information."
              link="/resident/profile-update"
              buttonText="Update Profile"
            />
          ) : (
            <MyCard
              icon="bxs-user-check"
              title="Update Your Profile"
              description="Some of your details might be outdated. Please update your profile."
              link="/resident/profile-update"
              buttonText="Update Now"
            />
          ))}

        <MyCard
          icon="bxs-message-error"
          title="Submit Complaint"
          description="Report issues or concerns to the society management for resolution."
          link="/resident/complaints"
          buttonText="Submit Complaint"
        />

        <MyCard
          icon="bxs-megaphone"
          title="Society Notices"
          description="Stay updated with important announcements from the society management."
          link="/resident/notices"
          buttonText="View Notices"
        />

        <MyCard
          icon="bxs-calendar-edit"
          title="Book Facilities"
          description="Reserve and book community facilities like clubhouse, gym, and more."
          link="/resident/facilities"
          buttonText="Book Now"
        />

        <MyCard
          icon="bxs-receipt"
          title="My Payments"
          description="View and manage your maintenance payments and transaction history."
          link="/resident/payment"
          buttonText="View Payments"
        />
      </div>
    </>
  );
};
