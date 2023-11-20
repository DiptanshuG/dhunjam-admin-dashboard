import React, { useEffect, useState } from "react";
import ColumnChart from "../components/dashboard/ColumnChart";
import { FaSignOutAlt } from "react-icons/fa";
import Loader from "../components/Loader/Loader";
import "../assets/styles/dashboard/Dashboard.css"

const Dashboard = ({ userData }) => {
  const [adminDetails, setAdminDetails] = useState({});
  const [editedPrices, setEditedPrices] = useState({});
  const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData && userData.id) {
      fetchAdminDetails(userData.id);
    }
  }, [userData]);
  


  const fetchAdminDetails = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/account/admin/${userId}`);
      const data = await response.json();

      if (response.status === 200 && data.response === "Success") {
        setAdminDetails(data.data);
        setEditedPrices(data.data.amount);
      } else {
        console.error("Error fetching Admin Details");
      }
    } catch (error) {
      console.error("Error during fetchAdminDetails:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceEdit = (category, value) => {
    setEditedPrices((prevPrices) => ({
      ...prevPrices,
      [category]: +value,
    }));
    setSaveButtonDisabled(false);
  };


  const handleSavePrices = async () => {
    const modifiedCategories = {};
Object.entries(editedPrices).forEach(([key, value]) => {
  if (key.startsWith("category_") && value !== adminDetails.amount[key]) {
    modifiedCategories[key] = value;
  }
});

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/account/admin/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: modifiedCategories,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.status === 200 && data.response === "Success") {
        fetchAdminDetails(userData.id);
        setSaveButtonDisabled(true);
      } else {
        console.error("Error updating prices");
      }
    } catch (error) {
      console.error("Error during handleSavePrices:", error);
    }
  };

  const chartData = {
    labels: Object.keys(editedPrices).filter((key) =>
      key.startsWith("category_")
    ),
    lineData: Object.values(editedPrices),
    columnData: Object.values(editedPrices),
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">
        {" "}
        {adminDetails.name}, {adminDetails.location} on Dhun Jam
      </h1>

      <div>
        <div className="price-input">
          <label className="amount-label">
            Do you want to change your
            <br /> customers for requesting songs?{" "}
          </label>
          <div className="radio-buttons">
            <input
              type="radio"
              id="changeYes"
              name="changeRequest"
              value="Yes"
              checked={editedPrices.changeRequest === "Yes"}
              onChange={() => handlePriceEdit("changeRequest", "Yes")}
            />
            <label htmlFor="changeYes">Yes</label>
            <input
              type="radio"
              id="changeNo"
              name="changeRequest"
              value="No"
              checked={editedPrices.changeRequest === "No"}
              onChange={() => handlePriceEdit("changeRequest", "No")}
            />
            <label htmlFor="changeNo">No</label>
          </div>
        </div>
        <div className="price-input ">
          <label className="amount-label">Custom Song Request Amount-</label>
          <input
            type="number"
            value={editedPrices.category_6 || ""}
            onChange={(e) =>
              handlePriceEdit("customRequestAmount", e.target.value)
            }
            className="custom-request-amount"
          />
        </div>
        <div className="price-input regular-song-amounts">
          <label className="amount-label">
            Regular Song Request Amounts, <br />
            from high to low-
          </label>
          <div
            style={{ display: "flex", justifyContent: "end", width: "400px" }}
          >
            {Object.entries(editedPrices)
              .filter(([key]) => key.startsWith("category_"))
              .map(([category, originalPrice]) => (
                <input
                  type="number"
                  value={editedPrices[category] || ""}
                  onChange={(e) => handlePriceEdit(category, e.target.value)}
                  key={category}
                />
              ))}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "25px 0",
        }}
      >
        <ColumnChart chartData={chartData} />
      </div>
      <button
        className="save-button"
        onClick={handleSavePrices}
        disabled={isSaveButtonDisabled}
      >
        Save
      </button>
      <button className="logout-button" title="logout" onClick={handleLogout}>
        <FaSignOutAlt />
      </button>
    </div>
  );
};

export default Dashboard;
