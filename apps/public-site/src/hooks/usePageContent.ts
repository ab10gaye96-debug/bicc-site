import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export function usePageContent(section: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      doc(db, 'pageContent', section),
      (snapshot) => {
        setData(snapshot.exists() ? snapshot.data() : null);
        setLoading(false);
      },
      (err) => {
        console.error(`Error listening to pageContent/${section}:`, err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [section]);

  return { data, loading, error };
}
