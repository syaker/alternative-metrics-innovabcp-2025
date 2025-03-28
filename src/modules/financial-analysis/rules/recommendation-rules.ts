import { CreditEvaluationCategory } from '@prisma/client';

export const RECOMMENDATIONS_BY_CATEGORY = {
  [CreditEvaluationCategory.BANK_TRANSACTIONS]: [
    'Sube 12 estados de cuenta bancarios (uno por mes) de enero a diciembre del 2025 para demostrar estabilidad financiera.',
    'Realiza al menos 3 depósitos mensuales en tu cuenta bancaria por montos similares para reflejar ingresos constantes.',
    'Evita retirar más del 50% de tu saldo disponible en un solo movimiento para mantener un flujo financiero estable.',
  ],
  [CreditEvaluationCategory.BILL_PAYMENT]: [
    'Paga tus facturas dentro de los primeros 5 días de cada mes para mantener un historial de pagos impecable.',
    'Sube 6 comprobantes de pago de servicios públicos de los últimos 6 meses para demostrar responsabilidad financiera.',
    'Configura un débito automático para al menos una de tus facturas recurrentes y evita retrasos en los pagos.',
  ],
  [CreditEvaluationCategory.RESIDENCE_AGE]: [
    'Sube un contrato de arrendamiento o un recibo de servicios públicos con tu nombre de al menos los últimos 12 meses.',
    'Si planeas mudarte, mantén actualizada tu dirección en tu banco y documentos oficiales en un plazo no mayor a 30 días.',
    'Solicita un certificado de residencia en tu municipalidad para demostrar estabilidad en tu domicilio.',
  ],
  [CreditEvaluationCategory.SOCIAL_MEDIA]: [
    'Publica 3 actualizaciones sobre tu actividad laboral en LinkedIn en los próximos 6 meses para mejorar tu credibilidad profesional.',
    'Elimina cualquier publicación en redes sociales que mencione dificultades financieras o deudas para evitar impactos negativos.',
    'Mantén actualizada tu información laboral en LinkedIn y Facebook para que coincida con la información de tus solicitudes de crédito.',
  ],
  [CreditEvaluationCategory.STABILITY_EMPLOYMENT]: [
    'Asegúrate de tener al menos 6 meses continuos en tu empleo antes de solicitar un crédito para mejorar tu perfil de estabilidad.',
    'Si eres freelancer, sube 3 contratos de trabajo firmados con clientes en los últimos 6 meses para demostrar ingresos recurrentes.',
    'Solicita una carta de trabajo que especifique tu antigüedad y salario y adjúntala a tu perfil financiero.',
  ],
};
