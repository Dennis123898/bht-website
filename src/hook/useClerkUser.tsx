import { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { writeUserData } from '../services/database';


export const useClerkUser = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      const userData = {
        email: user.primaryEmailAddress?.emailAddress || '',
        displayName: user.fullName || '',
        photoURL: user.imageUrl || '',
      };
      
      setIsLoading(true);
      writeUserData(user.id, userData)
        .then(() => {
          setIsLoading(false);
          setError(null);
        })
        .catch((err) => {
          setIsLoading(false);
          setError(err);
          console.error('Error writing user data to Firebase:', err);
        });
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return { user, isLoading, error };
};