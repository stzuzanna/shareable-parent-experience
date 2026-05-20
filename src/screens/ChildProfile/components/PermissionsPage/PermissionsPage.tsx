import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Redirects legacy /permissions route to inline About subpage. */
export const PermissionsPage = (): null => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/child-profile", { replace: true, state: { aboutSection: "permissions" } });
  }, [navigate]);

  return null;
};
