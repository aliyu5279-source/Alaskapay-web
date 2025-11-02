import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CohortAnalysisTableProps {
  data?: Array<{ cohort: string; month0: number; month1: number; month2: number; month3: number; month4: number; month5: number }>;
}

export default function CohortAnalysisTable({ data = [] }: CohortAnalysisTableProps) {
  const mockData = data.length > 0 ? data : [
    { cohort: 'Jan 2024', month0: 100, month1: 92, month2: 87, month3: 83, month4: 80, month5: 78 },
    { cohort: 'Feb 2024', month0: 100, month1: 94, month2: 89, month3: 85, month4: 82, month5: 0 },
    { cohort: 'Mar 2024', month0: 100, month1: 95, month2: 91, month3: 87, month4: 0, month5: 0 },
    { cohort: 'Apr 2024', month0: 100, month1: 96, month2: 92, month3: 0, month4: 0, month5: 0 },
    { cohort: 'May 2024', month0: 100, month1: 97, month2: 0, month3: 0, month4: 0, month5: 0 },
    { cohort: 'Jun 2024', month0: 100, month1: 0, month2: 0, month3: 0, month4: 0, month5: 0 }
  ];

  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    if (value >= 95) return 'bg-green-100';
    if (value >= 90) return 'bg-green-50';
    if (value >= 85) return 'bg-yellow-50';
    if (value >= 80) return 'bg-orange-50';
    return 'bg-red-50';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Retention Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort</TableHead>
                <TableHead>Month 0</TableHead>
                <TableHead>Month 1</TableHead>
                <TableHead>Month 2</TableHead>
                <TableHead>Month 3</TableHead>
                <TableHead>Month 4</TableHead>
                <TableHead>Month 5</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((row) => (
                <TableRow key={row.cohort}>
                  <TableCell className="font-medium">{row.cohort}</TableCell>
                  <TableCell className={getColor(row.month0)}>{row.month0}%</TableCell>
                  <TableCell className={getColor(row.month1)}>{row.month1 || '-'}%</TableCell>
                  <TableCell className={getColor(row.month2)}>{row.month2 || '-'}%</TableCell>
                  <TableCell className={getColor(row.month3)}>{row.month3 || '-'}%</TableCell>
                  <TableCell className={getColor(row.month4)}>{row.month4 || '-'}%</TableCell>
                  <TableCell className={getColor(row.month5)}>{row.month5 || '-'}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
