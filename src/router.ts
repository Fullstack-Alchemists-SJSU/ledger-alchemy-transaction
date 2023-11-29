import express from 'express';
import { getUserTransaction, syncUserTransaction } from './controllers/v1/transaction_controller';

const router = (app: express.Express) => {
    const baseApiRouter = express.Router();
    const v1Router = express.Router();
    const transactionRouter = express.Router();

    baseApiRouter.get('/', async (req, res) => {
        res.send('Hello World!');
    });

    /**
     * Transaction API Routes
     */
    transactionRouter.post('/fetch_user_transactions', getUserTransaction);
    transactionRouter.post('/sync_user_transactions', syncUserTransaction);

    v1Router.use('/transaction', transactionRouter);

    baseApiRouter.use('/v1', v1Router);
    app.use('/api', baseApiRouter);
};

export default router;