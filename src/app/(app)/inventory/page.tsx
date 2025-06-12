'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { InventoryPage } from './components/InventoryPage';
import { Material, InventoryItem } from '@prisma/client';
import Loading from '@/app/loading';

export default function Page() {
  const [items, setItems] = useState<(InventoryItem & { material: Material })[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, materialsRes] = await Promise.all([
          axios.get('/api/inventory'),
          axios.get('/api/materials')
        ]);
        setItems(itemsRes.data);
        setMaterials(materialsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <InventoryPage initialItems={items} materials={materials} />;
}
