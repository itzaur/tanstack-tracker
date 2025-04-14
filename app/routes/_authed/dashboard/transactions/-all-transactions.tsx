import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectContent } from '@radix-ui/react-select';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export default function AllTransactions({
  month,
  year,
  yearsRange,
}: {
  month: number;
  year: number;
  yearsRange: number[];
}) {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  const selectedDate = new Date(year, month - 1, 1);

  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>{format(selectedDate, 'MMM yyyy')} Transactions</span>
          <div className='flex gap-2'>
            <Select
              value={`${selectedMonth}`}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-popover translate-y-10 border-2 border-popover rounded-md shadow-lg'>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={`${i + 1}`}>
                    {format(new Date(selectedDate.getFullYear(), i, 1), 'MMM')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={`${selectedYear}`}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-popover translate-y-10 translate-x-21 border-2 border-popover rounded-md shadow-lg'>
                {yearsRange.map((year) => (
                  <SelectItem key={year} value={`${year}`}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild>
              <Link to='/dashboard/transactions'>Go</Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to='/dashboard/transactions/new'>New Transaction</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
