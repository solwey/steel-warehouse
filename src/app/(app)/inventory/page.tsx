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
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GroupedData = Record<string, InventoryItem[]>;

export default function InventoryPage() {
  const [groupBy, setGroupBy] = useState<string>('material');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [data, setData] = useState<InventoryItem[] | GroupedData>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/api/inventory', {
          params: { groupBy, onlyAvailable }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch inventory:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [groupBy, onlyAvailable]);

  const isGrouped = data && !Array.isArray(data);

  const filterItems = (items: InventoryItem[]) => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.material.name.toLowerCase().includes(query) ||
        item.material.grade.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
    );
  };

  return (
    <div className="w-[80vw] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 items-center bg-gray-50 p-4 rounded-lg">
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
          <label htmlFor="onlyAvailable" className="text-sm">
            Only available
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : isGrouped ? (
        Object.entries(data as GroupedData).map(([groupName, items]) => {
          const filteredItems = filterItems(items);
          if (filteredItems.length === 0) return null;

          return (
            <div key={groupName} className="mb-8">
              <h2 className="text-xl font-bold mb-2">{groupName}</h2>
              <div className="flex flex-col gap-4">
                {filteredItems.map((item) => (
                  <InventoryItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col gap-4">
          {filterItems(data as InventoryItem[]).map((item) => (
            <InventoryItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isLoading &&
        (isGrouped
          ? Object.values(data as GroupedData).every((items) => filterItems(items).length === 0)
          : filterItems(data as InventoryItem[]).length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            No items found matching your search criteria
          </div>
        )}
    </div>
  );
}
