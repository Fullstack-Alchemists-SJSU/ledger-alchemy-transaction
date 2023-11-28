// src/Transaction.ts
import { DataTypes } from 'sequelize';
import sequelize from '../db';

const Transaction = sequelize.define('Transaction', {
    transaction_id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    account_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_channel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    transaction_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pending: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    transaction_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    iso_currency_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    unofficial_currency_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    merchant_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    authorized_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    authorized_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    location: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    payment_meta: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    personal_finance_category: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    personal_finance_category_icon_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    counterparties: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    merchant_entity_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    check_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    personal_finance_category_primary: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    personal_finance_category_detailed: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    personal_finance_category_confidence_level: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: 'Transactions'
});

export default Transaction;



// EXAMPLE OF A TRANSACTION

// {
//     "account_id": "qEZkPke6AVfXbwJ41a3LCMAep6n9Q4Tg8alPN",
//     "account_owner": null,
//     "amount": 25,
//     "authorized_date": "2023-09-26",
//     "authorized_datetime": null,
//     "category": [
//       "Payment",
//       "Credit Card"
//     ],
//     "category_id": "16001000",
//     "check_number": null,
//     "counterparties": [],
//     "date": "2023-09-27",
//     "datetime": null,
//     "iso_currency_code": "USD",
//     "location": {
//       "address": null,
//       "city": null,
//       "country": null,
//       "lat": null,
//       "lon": null,
//       "postal_code": null,
//       "region": null,
//       "store_number": null
//     },
//     "logo_url": null,
//     "merchant_entity_id": null,
//     "merchant_name": null,
//     "name": "CREDIT CARD 3333 PAYMENT *//",
//     "payment_channel": "other",
//     "payment_meta": {
//       "by_order_of": null,
//       "payee": null,
//       "payer": null,
//       "payment_method": null,
//       "payment_processor": null,
//       "ppd_id": null,
//       "reason": null,
//       "reference_number": null
//     },
//     "pending": false,
//     "pending_transaction_id": null,
//     "personal_finance_category": {
//       "confidence_level": "LOW",
//       "detailed": "LOAN_PAYMENTS_CREDIT_CARD_PAYMENT",
//       "primary": "LOAN_PAYMENTS"
//     },
//     "personal_finance_category_icon_url": "https://plaid-category-icons.plaid.com/PFC_LOAN_PAYMENTS.png",
//     "transaction_code": null,
//     "transaction_id": "dPzbvbKRZVIE6onwRa7mTknWMXlzJPuJpxqbb",
//     "transaction_type": "special",
//     "unofficial_currency_code": null,
//     "website": null
//   },