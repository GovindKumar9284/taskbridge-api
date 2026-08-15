import { Model } from 'objection';

export default class SharedExpense extends Model {
  static tableName = 'shared_expenses';

  static jsonAttributes = ['participants'];

  static jsonSchema = {
    type: 'object',
    required: ['project_id', 'payer_id', 'amount', 'participants', 'org_id'],
    properties: {
      id: { type: 'integer' },
      project_id: { type: 'integer' },
      payer_id: { type: 'string' },
      amount: { type: 'number' },
      currency: { type: 'string' },
      participants: {
        type: 'array',
        items: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { type: 'string' },
            share: { type: 'number' }
          }
        }
      },
      org_id: { type: 'string' },
      created_at: { type: 'string', format: 'date-time' }
    }
  };
}
