import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Triangle } from "react-loader-spinner";
import "./LoaderSpinner.css";

function LoaderSpinner({height = 180, width = 180, message = "..."}) {
  return (
    <div className="center-load-text">
      <h1>Loading {message}</h1>
      <div className="loader-spinner-container">
        <Triangle color="#00BFFF" height={height} width={width} />
      </div>
    </div>
  );
}

export default LoaderSpinner;
