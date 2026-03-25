import { ActionResult } from "@/types";
import clsx from "clsx";
import {
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

type Props = {
  result: ActionResult<string> | null;
};

export default function ResultMessage({
  result,
}: Props) {
  if (!result) return null;

  const isSuccess = result.status === "success";

  return (
    <div
      className={clsx(
        "p-3 rounded-xl w-full flex items-center justify-center gap-x-2.5 text-sm border",
        {
          "text-danger-800 bg-danger-50 border-danger-100":
            !isSuccess,
          "text-success-800 bg-success-50 border-success-100":
            isSuccess,
        }
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center rounded-full h-6 w-6 border",
          {
            "bg-success-100 border-success-200": isSuccess,
            "bg-danger-100 border-danger-200": !isSuccess,
          }
        )}
      >
        {isSuccess ? (
          <FaCheckCircle size={13} />
        ) : (
          <FaExclamationTriangle size={13} />
        )}
      </div>
      <p className="font-medium">
        {isSuccess ? result.data : (result.error as string)}
      </p>
    </div>
  );
}