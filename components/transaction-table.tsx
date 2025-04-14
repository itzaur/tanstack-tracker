import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import numeral from 'numeral';
import { Button } from './ui/button';
import { PencilIcon } from 'lucide-react';

export default function TransactionTable({
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
  console.log('TRANSACTIONS: ', { transactions });

  return (
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
            <TableCell className='text-right'>
              <Button
                variant='outline'
                size='icon'
                aria-label='Edit transaction'
              >
                <PencilIcon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
