import authMiddleware from '@/authMiddleware';
import { db } from '@/db';
import { categoriesTable, transactionsTable } from '@/db/schema';
import { createServerFn } from '@tanstack/react-start';
import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

const MONTHS_IN_YEAR = 12;

const schema = z.object({
  year: z.number(),
});

export const getAnnualCashflow = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ context, data }) => {
    const cashflow = await db
      .select({
        month: sql<string>`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`,
        totalIncome: sql<string>`SUM(CASE WHEN ${categoriesTable.type} = 'income' THEN ${transactionsTable.amount} ELSE 0 END)`,
        totalExpense: sql<string>`SUM(CASE WHEN ${categoriesTable.type} = 'expense' THEN ${transactionsTable.amount} ELSE 0 END)`,
      })
      .from(transactionsTable)
      .leftJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id)
      )
      .where(
        and(
          eq(transactionsTable.userId, context.userId),
          sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate}) = ${data.year}`
        )
      )
      .groupBy(sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`);

    const annualCashflow: {
      month: number;
      income: number;
      expenses: number;
    }[] = [];

    for (let i = 1; i <= MONTHS_IN_YEAR; i++) {
      const monthlyCashflow = cashflow.find((row) => +row.month === i);

      annualCashflow.push({
        month: i,
        income: +(monthlyCashflow?.totalIncome ?? 0),
        expenses: +(monthlyCashflow?.totalExpense ?? 0),
      });
    }

    return annualCashflow;
  });
