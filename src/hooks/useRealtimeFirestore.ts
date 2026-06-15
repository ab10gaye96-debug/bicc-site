import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';

interface RealtimeState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

export function useRealtimeDoc<T>(
  collectionName: string,
  documentId: string,
  fallback: T,
  enabled = true,
): RealtimeState<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setData(fallback);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      doc(db, collectionName, documentId),
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ ...fallback, ...snapshot.data() } as T);
        } else {
          setData(fallback);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Error listening to ${collectionName}/${documentId}:`, err);
        setError(err.message);
        setData(fallback);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [collectionName, documentId, enabled]);

  return { data, loading, error };
}

export function useRealtimeCollection<T = any>(
  collectionName: string,
  fallback: T[] = [],
  constraints: QueryConstraint[] = [],
): RealtimeState<T[]> {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const baseRef = collection(db, collectionName);
    const target = constraints.length > 0 ? query(baseRef, ...constraints) : baseRef;

    const unsubscribe = onSnapshot(
      target,
      (snapshot) => {
        const items = snapshot.docs.map((entry) => ({
          id: entry.id,
          ...entry.data(),
        })) as T[];

        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error listening to ${collectionName}:`, err);
        setError(err.message);
        setData(fallback);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [collectionName, ...constraints]);

  return { data, loading, error };
}
