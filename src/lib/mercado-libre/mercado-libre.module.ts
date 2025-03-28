import { Module } from '@nestjs/common';

import {
  ExpenseType,
  TransactionCurrency,
  TransactionPaymentMethod,
  TransactionType,
} from '@prisma/client';
import { MercadoLibreService } from './mercado-libre.service';

@Module({
  providers: [MercadoLibreService],
})
export class MercadoLibreModule {
  getTransactions(userId: number) {
    return [
      {
        amount: 100.45,
        currency: TransactionCurrency.PEN,
        transactionType: TransactionType.INCOME,
        category: ExpenseType.CERTIFICATIONS,
        merchantName: 'Empresa Ejemplo',
        paymentMethod: TransactionPaymentMethod.CREDIT_CARD,
        source: 'Factura Digital',
        location: {},
        metadata: {},
        invoiceNumber: '123456',
        userId: userId,
      },
    ];
  }
}
