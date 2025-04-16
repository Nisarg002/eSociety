import React, { useState } from "react";
import axios from "axios";

export const Razorpay = ({ amount, onSuccess, onFailure, paymentDetails }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateOrder = async () => {
    try {
      setIsProcessing(true);

      // Convert amount to paise (smallest currency unit)
      const amountInPaise = Math.round(amount * 100);

      // console.log(`Creating order for amount: ${amountInPaise} paise`);

      // console.log("Payment details:", paymentDetails);
      const order = await axios.post("/payment/create_order/", {
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
        payment_details: paymentDetails, // Include payment details in order creation
      });

      // console.log("Order creation response:", order.data);
      displayRazorpay(order.data);
    } catch (error) {
      console.error("Order creation failed:", error);
      alert(
        `Failed to create payment order: ${error.message || "Unknown error"}`
      );
      setIsProcessing(false);
      if (onFailure) onFailure(error);
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve(true);
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (orderData) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      if (onFailure) onFailure("SDK failed to load");
      return;
    }

    // Get user data from localStorage with fallbacks
    const userName = localStorage.getItem("name") || "Resident";
    const userEmail = localStorage.getItem("email") || "resident@example.com";
    const userPhone = localStorage.getItem("phone") || "";

    const options = {
      key: "rzp_test_OSxHecT45UpnWE",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Society Management",
      description: `${paymentDetails.type} - ${paymentDetails.description}`,
      order_id: orderData.id,
      handler: async function (response) {
        try {
          // Log the payment response from Razorpay
          // console.log("Payment success response from Razorpay:", response);

          const verificationPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            payment_details: paymentDetails,
          };

          // console.log("Sending verification payload to backend:", {
          //   ...verificationPayload,
          //   razorpay_signature: "[SIGNATURE HIDDEN]", // Don't log the actual signature
          // });

          const res = await axios.post(
            "/payment/verify_order/",
            verificationPayload
          );

          // console.log("Verification response from backend:", res.data);

          if (res.data.status === "success") {
            if (onSuccess) onSuccess(response);
          } else {
            console.error("Verification failed:", res.data);
            alert(
              `Payment verification failed: ${
                res.data.detail || res.data.message || ""
              }`
            );
            if (onFailure)
              onFailure({
                message: "Verification failed",
                details: res.data,
              });
          }
        } catch (error) {
          console.error("Payment verification error:", error);

          // Check for response data in the error
          const errorMessage =
            error.response?.data?.detail || error.message || "Unknown error";
          alert(`Payment verification error: ${errorMessage}`);

          if (onFailure) onFailure(error);
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: userName,
        email: userEmail,
        contact: userPhone,
      },
      theme: {
        color: "#4CAF50",
      },
      // Add modal closing handlers
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          // console.log("Payment modal closed");
        },
      },
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
        if (onFailure) onFailure(response.error);
      });

      paymentObject.open();
    } catch (error) {
      console.error("Razorpay open failed:", error);
      setIsProcessing(false);
      if (onFailure) onFailure(error);
    }
  };

  return (
    <button
      className="action-btn check-in-btn"
      onClick={handleCreateOrder}
      disabled={isProcessing}
    >
      <i className="bx bxs-credit-card"></i>
      <span>{isProcessing ? "Processing..." : "Pay Now"}</span>
    </button>
  );
};

export default Razorpay;
