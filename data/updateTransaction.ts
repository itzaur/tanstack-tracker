import authMiddleware from '@/authMiddleware';
import { createServerFn } from '@tanstack/start';
import { z } from 'zod';
import { transactionSchema } from './createTransaction';
import { db } from '@/db';
import { transactionsTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

const schema = transactionSchema.extend({
  id: z.number(),
});

export const updateTransaction = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ context, data }) => {
    await db
      .update(transactionsTable)
      .set({
        // userId: context.userId,
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: data.transactionDate,
      })
      .where(
        and(
          eq(transactionsTable.id, data.id),
          eq(transactionsTable.userId, context.userId)
        )
      );
  });
