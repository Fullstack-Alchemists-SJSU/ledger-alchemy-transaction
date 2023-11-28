
import sequelize from '../../db/db';
import Transaction from '../../db/models/Transaction';
import BankAccount from '../../db/models/BankAccount';
import plaidClient from '../../utils/plaidClient';

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synchronized');
});

// To fetch and store transactions
export const fetchUserTransaction = async (req: any, res: any) => {
    const { user_id, access_token } = req.body;

    try {
        const bankAccounts = await BankAccount.findAll({
            where: { user_id: user_id }
        });

        for (const account of bankAccounts) {
            // Fetch transactions from Plaid
            const response = await plaidClient.transactionsGet({
                access_token: access_token,
                start_date: '2021-01-01', // Dates to be fixed for a month period or to be taken as input from user.
                end_date: '2023-11-15',
                options: {
                    account_ids: ['3evnlyMGeWCNEWkv7pNqIW63MKeryBuZvm4KZ', '3evnlyMGeWCNEWkv7pNqIW63MKeryBuZvm4KZ'] //[account.account_id]
                }
            });

            const transactions = response.data.transactions;
            console.log(transactions);

            // Store each transaction in the database
            await storeTransactions(transactions);
        }

        res.send('Transactions fetched and stored successfully.');
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send('Internal Server Error');
    }
};

async function storeTransactions(transactions: any[]): Promise<void> {
    for (const trans of transactions) {
        await Transaction.create({
            transaction_id: trans.transaction_id,
            account_id: trans.account_id,
            amount: trans.amount,
            date: new Date(trans.date),
            name: trans.name,
            payment_channel: trans.payment_channel,
            transaction_type: trans.transaction_type,
            category: trans.category,
            category_id: trans.category_id,
            pending: trans.pending,
            transaction_code: trans.transaction_code,
            iso_currency_code: trans.iso_currency_code,
            unofficial_currency_code: trans.unofficial_currency_code,
            merchant_name: trans.merchant_name,
            authorized_date: trans.authorized_date ? new Date(trans.authorized_date) : null,
            authorized_datetime: trans.authorized_datetime ? new Date(trans.authorized_datetime) : null,
            location: JSON.stringify(trans.location),
            payment_meta: JSON.stringify(trans.payment_meta),
            personal_finance_category_primary: trans.personal_finance_category?.primary,
            personal_finance_category_detailed: trans.personal_finance_category?.detailed,
            personal_finance_category_confidence_level: trans.personal_finance_category?.confidence_level,
            personal_finance_category_icon_url: trans.personal_finance_category?.icon_url,
            logo_url: trans.logo_url,
            merchant_entity_id: trans.merchant_entity_id,
            check_number: trans.check_number,
            website: trans.website,
            counterparties: JSON.stringify(trans.counterparties)
        });
    }
}