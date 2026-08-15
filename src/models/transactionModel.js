// Transaction model definition
export default class Transaction {
  constructor({ id, userId, amount, currency = 'USD', description = null, metadata = null, createdAt = null }) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.currency = currency;
    this.description = description;
    this.metadata = metadata;
    this.createdAt = createdAt ?? new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      amount: this.amount,
      currency: this.currency,
      description: this.description,
      metadata: this.metadata,
      createdAt: this.createdAt,
    };
  }
}
