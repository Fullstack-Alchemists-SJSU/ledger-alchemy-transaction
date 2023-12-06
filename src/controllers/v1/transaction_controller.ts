import Transaction from '../../db/models/Transaction'
import BankAccount from '../../db/models/BankAccount'
import plaidClient from '../../utils/plaidClient'
import fs from 'fs'
import path from 'path'

// To fetch and store transactions
export const getUserTransaction = async (req: any, res: any) => {
	const {userSub} = req.body
	const currentDate = new Date()
	const threeMonthsAgo = new Date(
		currentDate.setMonth(currentDate.getMonth() - 3)
	)
		.toISOString()
		.split('T')[0]
	const todayDate = new Date().toISOString().split('T')[0]

	try {
		const bankAccounts = await BankAccount.findAll({
			where: {user_id: userSub},
			attributes: ['access_token', 'account_id'],
		})

		// Group accounts by access token
		const accountsByToken = new Map()
		for (const account of bankAccounts) {
			const accessToken = account.dataValues.access_token
			const accountId = account.dataValues.account_id

			if (!accountsByToken.has(accessToken)) {
				accountsByToken.set(accessToken, [])
			}
			accountsByToken.get(accessToken).push(accountId)
		}

		let allTransactions: any[] = []
		for (const [accessToken, accountIds] of accountsByToken.entries()) {
			// Get transactions from Plaid
			const response = await plaidClient.transactionsGet({
				access_token: accessToken,
				start_date: threeMonthsAgo,
				end_date: todayDate, // Today's date in YYYY-MM-DD format
				options: {
					account_ids: accountIds,
				},
			})

			allTransactions = allTransactions.concat(response.data.transactions)
		}

		res.json(allTransactions)
	} catch (error) {
		console.error('Error fetching transactions:', error)
		res.status(500).send('Internal Server Error')
	}
}

export const syncUserTransaction = async (req: any, res: any) => {
	const {userSub} = req.body

	try {
		const bankAccounts = await BankAccount.findAll({
			where: {user_id: userSub},
			attributes: ['access_token'],
		})

		for (const account of bankAccounts) {
			let cursor = '' // Start with null for the first sync
			let hasMore = true

			while (hasMore) {
				const response = await plaidClient.transactionsSync({
					access_token: account.dataValues.access_token,
					cursor: cursor,
					count: 100, // optional, adjust as needed
				})

				const {added, modified, removed, has_more, next_cursor} =
					response.data

				// Process and store the transactions
				// Example function to handle storage
				await storeSyncTransactions(added, modified, removed, userSub)

				hasMore = has_more
				cursor = next_cursor
			}
		}

		res.send('Transactions synced and stored successfully.')
	} catch (error) {
		console.error('Error syncing transactions:', error)
		res.status(500).send('Internal Server Error')
	}
}

async function storeGetTransactions(
	transactions: any[],
	userSub: string
): Promise<void> {
	for (const trans of transactions) {
		await Transaction.create(mapTransactionFields(trans, userSub))
	}
}

async function storeSyncTransactions(
	added: any[],
	modified: any[],
	removed: any[],
	userSub: string
): Promise<void> {
	// Handle added transactions
	for (const trans of added) {
		await Transaction.upsert(mapTransactionFields(trans, userSub))
	}

	// Handle removed transactions
	for (const trans of removed) {
		await Transaction.destroy({
			where: {transaction_id: trans.transaction_id},
		})
	}

	// Handle modified transactions
	for (const trans of modified) {
		await Transaction.update(mapTransactionFields(trans, userSub), {
			where: {transaction_id: trans.transaction_id},
		})
	}
}

function mapTransactionFields(trans: any, userSub: string) {
	return {
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
		authorized_date: trans.authorized_date
			? new Date(trans.authorized_date)
			: null,
		authorized_datetime: trans.authorized_datetime
			? new Date(trans.authorized_datetime)
			: null,
		location: JSON.stringify(trans.location),
		payment_meta: JSON.stringify(trans.payment_meta),
		personal_finance_category_primary:
			trans.personal_finance_category?.primary,
		personal_finance_category_detailed:
			trans.personal_finance_category?.detailed,
		personal_finance_category_confidence_level:
			trans.personal_finance_category?.confidence_level,
		personal_finance_category_icon_url:
			trans.personal_finance_category?.icon_url,
		logo_url: trans.logo_url,
		merchant_entity_id: trans.merchant_entity_id,
		check_number: trans.check_number,
		website: trans.website,
		counterparties: JSON.stringify(trans.counterparties),
		userSub,
	}
}

export const readTransactions = async (req: any, res: any) => {
	const userSub = req.params.userSub
	const {accountId} = req.query

	try {
		const queryOptions = {
			where: {user_sub: userSub},
			order: [['date', 'DESC']], // example of ordering by date
		}

		// Add optional filters based on query parameters
		if (accountId) queryOptions.where.user_sub = accountId

		const transactions = await Transaction.findAll(queryOptions as any)

		if (!transactions) {
			return res.status(404).json({message: 'No transactions found.'})
		}

		res.json(transactions)
	} catch (error) {
		console.error('Error fetching transactions:', error)
		res.status(500).json({message: 'Internal server error'})
	}
}
