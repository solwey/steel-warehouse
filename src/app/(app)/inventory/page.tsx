'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { InventoryItem, InventoryItemCard } from './components/InventoryItemCard';

type GroupedData = Record<string, InventoryItem[]>;

export default function InventoryPage() {
  const [groupBy, setGroupBy] = useState<string>('material');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [data, setData] = useState<InventoryItem[] | GroupedData>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/inventory', {
          params: { groupBy, onlyAvailable }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch inventory:', err);
      }
    };

    fetchData();
  }, [groupBy, onlyAvailable]);

  const isGrouped = data && !Array.isArray(data);

  return (
    <div className="p-6 w-full max-w-none mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="location">Location</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Switch id="onlyAvailable" checked={onlyAvailable} onCheckedChange={setOnlyAvailable} />
          <label htmlFor="onlyAvailable">Only available</label>
        </div>
      </div>

      {isGrouped ? (
        Object.entries(data as GroupedData).map(([groupName, items]) => (
          <div key={groupName} className="mb-8">
            <h2 className="text-xl font-bold mb-2">{groupName}</h2>
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <InventoryItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col gap-4">
          {(data as InventoryItem[]).map((item) => (
            <InventoryItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
