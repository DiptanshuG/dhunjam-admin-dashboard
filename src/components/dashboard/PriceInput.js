import React from "react";

const PriceInput = ({ editedPrices, handlePriceEdit, adminDetails }) => {
  return (
    <div className="inputs-container">
      <div className="price-input">
        <label className="amount-label">
          Do you want to charge your
          <br /> customers for requesting songs?
        </label>
        <div className="radio-buttons">
          <input
            type="radio"
            id="changeYes"
            name="changeRequestYes"
            value="Yes"
            checked={adminDetails.charge_customers === true}
            onChange={() => handlePriceEdit("charge_customers", true)}
          />
          <label htmlFor="changeYes">Yes</label>
          <input
            type="radio"
            id="changeNo"
            name="changeRequestNo"
            value="No"
            checked={adminDetails.charge_customers === false}
            onChange={() => handlePriceEdit("charge_customers", false)}
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
          min="99"
          disabled={adminDetails.charge_customers === false}
        />
      </div>
      <div className="price-input regular-song-amounts">
        <label className="amount-label">
          Regular Song Request Amounts, <br />
          from high to low-
        </label>
        <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
          {Object.entries(editedPrices)
            .filter(
              ([key]) => key.startsWith("category_") && key !== "category_6"
            )
            .map(([category, originalPrice]) => (
              <input
                type="number"
                value={editedPrices[category] || ""}
                onChange={(e) => handlePriceEdit(category, e.target.value)}
                key={category}
                disabled={adminDetails.charge_customers === false}
                min={
                  category === "category_7"
                    ? 79
                    : category === "category_8"
                    ? 59
                    : category === "category_9"
                    ? 39
                    : category === "category_10"
                    ? 19
                    : ""
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PriceInput;
