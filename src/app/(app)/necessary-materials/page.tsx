'use client';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';

import { UrgencyLevel } from '@prisma/client';
import NecessaryMaterialCard, { NecessaryMaterial } from './components/NecessaryMaterialCard';

type GroupedData = Record<string, NecessaryMaterial[]>;

export default function NecessaryMaterialsPage() {
  const [groupBy, setGroupBy] = useState<string>('material');
  const [urgency, setUrgency] = useState<UrgencyLevel | 'all'>('all');
  const [data, setData] = useState<NecessaryMaterial[] | GroupedData>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/necessary-materials', {
          params: { groupBy, urgency: urgency === 'all' ? undefined : urgency }
        });
        setData(res.data);
      } catch (err: any) {
        if (err.response && err.response.data && err.response.data.error) {
          console.error('Server error:', err.response.data.error);
        } else {
          console.error('Failed to fetch necessary materials:', err);
        }
      }
    };

    fetchData();
  }, [groupBy, urgency]);

  const isGrouped = data && !Array.isArray(data);

  return (
    <div className="p-6 w-full max-w-none mx-auto">
      <h1 className="text-2xl font-bold mb-4">Necessary Materials</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="due_date">Due Date</SelectItem>
          </SelectContent>
        </Select>

        <Select value={urgency} onValueChange={setUrgency as any}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isGrouped ? (
        Object.entries(data as GroupedData).map(([groupName, items]) => (
          <div key={groupName} className="mb-8">
            <h2 className="text-xl font-bold mb-2">{groupName}</h2>
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <NecessaryMaterialCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col gap-4">
          {(data as NecessaryMaterial[]).map((item) => (
            <NecessaryMaterialCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
