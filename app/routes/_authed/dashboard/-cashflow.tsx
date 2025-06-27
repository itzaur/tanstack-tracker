import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from '@tanstack/react-router';

export function Cashflow({
  yearsRange,
  year,
}: {
  yearsRange: number[];
  year: number;
}) {
  const navigate = useNavigate();

  return (
    <Card className='mb-5'>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          <span>Cashflow</span>
          <div>
            <Select
              defaultValue={`${year}`}
              onValueChange={(value) => {
                navigate({
                  to: '/dashboard',
                  search: {
                    cfyear: +value,
                  },
                });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearsRange.map((year) => (
                  <SelectItem key={year} value={`${year}`}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
