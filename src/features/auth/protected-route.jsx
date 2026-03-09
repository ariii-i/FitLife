import { Navigate, useNavigate } from "react-router-dom";
import { auth } from "../../shared/lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export const ProtectedRoute = ({ children }) => {
    const navigate=useNavigate()
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setAuthChecked(true);
        })

        return () => unsubscribe();
    }, [])

    if (!authChecked) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // navigate("/")
    return children;
};