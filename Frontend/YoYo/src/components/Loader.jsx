import { useContext } from "react";
import { GeneralContext } from "@/context/GeneralContext";
import "ldrs/infinity";

function Loader() {
  const { isLoading } = useContext(GeneralContext);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <l-infinity size="180" color="white" />
        </div>
      )}
    </>
  );
}

export default Loader;
