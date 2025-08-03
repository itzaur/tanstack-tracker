import TransactionTable from '@/components/transaction-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import numeral from 'numeral';

export function RecentTransaction({
  transactions,
}: {
  transactions: {
    id: number;
    description: string;
    amount: string;
    transactionDate: string;
    category: string | null;
    transactionType: 'income' | 'expense' | null;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          <span>Recent transaction</span>
          <div className='flex gap-2'>
            <Button asChild variant='outline'>
              <Link to='/dashboard/transactions'>View All</Link>
            </Button>
            <Button asChild>
              <Link to='/dashboard/transactions/new'>Create New</Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table className='mt-4'>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(transaction.transactionDate, 'do MMM yyyy')}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className='capitalize'>
                  <Badge
                    className={
                      transaction.transactionType === 'income'
                        ? 'bg-lime-500'
                        : 'bg-orange-500'
                    }
                  >
                    {transaction.transactionType}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  ${numeral(transaction.amount).format('0,0[.]00')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
