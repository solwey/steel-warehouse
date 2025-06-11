'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { InventoryPage } from './components/InventoryPage';
import { Material, InventoryItem } from '@prisma/client';

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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <InventoryPage initialItems={items} materials={materials} />;
}
