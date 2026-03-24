import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../shared/lib/firebase";

export const ProtectedRoute = ({ children }: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) return <div>Loading</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};