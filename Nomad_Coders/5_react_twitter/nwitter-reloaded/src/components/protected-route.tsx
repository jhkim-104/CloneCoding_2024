import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser; // 로그인 되지 않은 경우 null 받음
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
