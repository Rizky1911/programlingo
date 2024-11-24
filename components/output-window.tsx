import { Output } from "@/lib/interface";
import React from "react";

const OutputWindow = ({ outputDetails }: { outputDetails: Output }) => {
  const getOutput = () => {
    const statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <pre className="px-2 py-1 font-normal text-sm text-red-500">
          {atob(outputDetails?.compile_output as string)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="px-2 py-1 font-normal text-sm text-green-500">
          {atob(outputDetails.stdout as string) !== null
            ? `${atob(outputDetails.stdout as string)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="px-2 py-1 font-normal text-sm text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 font-normal text-sm text-red-500">
          {atob(outputDetails?.stderr as string)}
        </pre>
      );
    }
  };
  return (
    <>
      <div className="w-full h-56 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto">
        {outputDetails ? <>{getOutput()}</> : null}
      </div>
    </>
  );
};

export default OutputWindow;
