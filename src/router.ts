import express from 'express'
import {
	getUserTransaction,
	syncUserTransaction,
	readTransactions,
} from './controllers/v1/transaction_controller'

const router = (app: express.Express) => {
	const baseApiRouter = express.Router()
	const v1Router = express.Router()
	const transactionRouter = express.Router()

	/**
	 * Transaction API Routes
	 */
	transactionRouter.get('/hello', async (req, res) => {
		res.send('Hello World!')
	})
	transactionRouter.post('/get_user_transactions', getUserTransaction)
	transactionRouter.post('/sync_user_transactions', syncUserTransaction)
	transactionRouter.get('/read_user_transactions', readTransactions)

	v1Router.use('/transaction', transactionRouter)

	baseApiRouter.use('/v1', v1Router)
	app.use('/api', baseApiRouter)
}

export default router
