import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Globe, TrendingUp, TrendingDown } from 'lucide-react';

export default function GeographicDeliveryMap() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchGeoData();
  }, []);

  const fetchGeoData = async () => {
    const { data: geoData, error } = await supabase
      .from('geographic_delivery_metrics')
      .select('*')
      .order('delivered', { ascending: false })
      .limit(20);

    if (!error && geoData) {
      setData(geoData);
    }
  };

  const getDeliveryBadge = (rate: number) => {
    if (rate >= 0.95) return <Badge variant="default">Excellent</Badge>;
    if (rate >= 0.85) return <Badge variant="secondary">Good</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Geographic Delivery Success
        </CardTitle>
        <CardDescription>Delivery and engagement rates by country</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Delivered</TableHead>
              <TableHead className="text-right">Delivery Rate</TableHead>
              <TableHead className="text-right">Engagement Rate</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.country_name}</TableCell>
                <TableCell className="text-right">{item.delivered.toLocaleString()}</TableCell>
                <TableCell className="text-right">{(parseFloat(item.delivery_rate) * 100).toFixed(1)}%</TableCell>
                <TableCell className="text-right">{(parseFloat(item.engagement_rate) * 100).toFixed(1)}%</TableCell>
                <TableCell>{getDeliveryBadge(parseFloat(item.delivery_rate))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
