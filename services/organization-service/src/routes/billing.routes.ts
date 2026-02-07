import { Router } from 'express';
import * as BillingController from '../controllers/billing.controller';
import express from 'express';

const router = Router();

router.post('/checkout', BillingController.createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), BillingController.handleWebhook);

export default router;
