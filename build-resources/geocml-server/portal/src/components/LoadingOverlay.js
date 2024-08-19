import { useSelector } from "react-redux";

export function LoadingOverlay() {
  const loading = useSelector((state) => state.app.loading);

  if (loading) {
    return (
      <div className="bg-dark w-100 h-100 fixed-top d-flex justify-content-center">
        <div
          id="spinner"
          className="spinner-border text-primary flex-row position-absolute"
          style={{
            width: "256px",
            height: "256px",
            top: 120,
          }}
          role="status"
        ></div>
        <p
          id="status-label"
          className="text-white flex-row position-absolute"
          style={{
            top: 425,
          }}
        >
          Loading geoCML Server Portal...
        </p>
      </div>
    );
  }

  return <div></div>;
}
