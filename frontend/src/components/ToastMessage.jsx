import { Toaster } from "react-hot-toast";

export default function ToastMessage() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: "var(--card)",
          color: "var(--primary)",
          padding: "6px 10px",
          borderRadius: "0px 0px 10px 10px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          border: "1px solid var(--border)",
        },
      }}
      containerStyle={{
        top: 25,
        right: 15,
      }}
    />
  );
}