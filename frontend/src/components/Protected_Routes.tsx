import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PlantLoader from "./PlantLoader";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { access_token, loading } = useAuth();

  if (loading) {
    return <PlantLoader />;
  }

  if (!access_token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;