import { useEffect, useState } from 'react';
import { getPostAssets } from '../appwriteDB/postAssets';

const usePostAssets = (assetIds: string[]) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const responses = await Promise.all(
          assetIds.map(async (assetId: string) => {
            return await getPostAssets(assetId);
          })
        );
        setAssets(responses);
      } catch (err) {
        console.error('Error occurred while fetching post assets:', err);
        setError('Failed to load assets');
      }
    };

    if (assetIds.length > 0) {
      fetchAssets();
    }
  }, [assetIds]);

  return { assets, error };
};

export default usePostAssets;
