import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./AuthProvider";

const RequireAuth = ({ allowedRoles }) => {
    const { data } = useContext(AuthContext);
    const location = useLocation();
    return (
        data?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : <Navigate to="/sign-in" state={{ from: location }} replace />
    );
}

{/*data?.accessToken //changed from user to accessToken to persist login after refresh
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
    :*/} 

export default RequireAuth;