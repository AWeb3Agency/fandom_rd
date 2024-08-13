import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const useSupabaseQuery = ({ table, select = '*', filter }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const memoizedFilter = useMemo(() => filter, [filter?.column, filter?.value]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let query = supabase.from(table).select(select);

        if (memoizedFilter) {
          query = query.eq(memoizedFilter.column, memoizedFilter.value);
        }

        const { data, error } = await query;

        if (error) throw error;

        setData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, select, memoizedFilter]);

  return { data, error, loading };
};
