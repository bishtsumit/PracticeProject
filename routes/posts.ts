import express from 'express';
import controller from '../controllers/wallet';
const router = express.Router();

router.post('/wallet', controller.setupWallet);
router.post('/transact/:walletId', controller.createTransaction);
router.get('/transactions', controller.getTransactions);
router.get('/wallet/:id', controller.getWalletDetail);

export = router;