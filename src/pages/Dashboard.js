import React, { useEffect, useState } from "react";
import ColumnChart from "../components/dashboard/ColumnChart";
import { FaSignOutAlt } from "react-icons/fa";
import Loader from "../components/Loader/Loader";
import "../assets/styles/dashboard/Dashboard.css";
import { fetchAdminDetails, updateAdminPrices } from "../services/api";
import PriceInput from "../components/dashboard/PriceInput";
import { ToastContainer } from "react-toastify";

const Dashboard = ({ userData }) => {
  const [adminDetails, setAdminDetails] = useState({});
  const [editedPrices, setEditedPrices] = useState({});
  const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData && userData.id) {
      fetchAdminData(userData.id);
    }
  }, [userData]);

  const fetchAdminData = async (userId) => {
    setLoading(true);
    const adminData = await fetchAdminDetails(userId);
    if (adminData) {
      setAdminDetails(adminData);
      setEditedPrices(adminData.amount);
      setSaveButtonDisabled(adminData.charge_customers === false);
    }
    setLoading(false);
  };

  const handlePriceEdit = (category, value) => {
    const numericValue = +value;
    // Check if the category is "charge_customers"
    if (category === "charge_customers") {
      setAdminDetails((details) => ({
        ...details,
        charge_customers: value,
      }));
      setSaveButtonDisabled(value === false);
    } else if (category === "customRequestAmount") {
      // Enable save button only if the value is higher than 99
      setSaveButtonDisabled(numericValue <= 99);
      setEditedPrices((prevPrices) => ({
        ...prevPrices,
        category_6: value,
      }));
    } else if (category.startsWith("category_")) {
      // Check minimum values for Regular Song Request Amounts
      const minValues = {
        category_7: 79,
        category_8: 59,
        category_9: 39,
        category_10: 19,
      };
      const minAllowed = minValues[category];
      const isValid = numericValue >= minAllowed;

      setSaveButtonDisabled(!isValid);
    } else {
      // Enable save button for other categories
      setSaveButtonDisabled(false);
    }

    setEditedPrices((prevPrices) => ({
      ...prevPrices,
      [category]: numericValue,
    }));
  };

  const handleSavePrices = async () => {
    try {
      const modifiedCategories = {};
      Object.entries(editedPrices).forEach(([key, value]) => {
        if (key.startsWith("category_") && value !== adminDetails.amount[key]) {
          modifiedCategories[key] = value;
        }
      });
      const success = await updateAdminPrices(userData.id, modifiedCategories);

      if (success) {
        setTimeout(() => {
          fetchAdminData(userData.id);
        }, 2000);
        setSaveButtonDisabled(true);
      }
    } catch (error) {
      console.error("Error saving prices and fetching admin data:", error);
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
      <ToastContainer />

      <div>
        <h1 className="dashboard-heading">
          {adminDetails.name}, {adminDetails.location} on Dhun Jam
        </h1>
        <PriceInput
          editedPrices={editedPrices}
          handlePriceEdit={handlePriceEdit}
          adminDetails={adminDetails}
        />
        <div className="centered-chart-container">
          {adminDetails.charge_customers && (
            <ColumnChart chartData={chartData} />
          )}
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
    </div>
  );
};

export default Dashboard;
