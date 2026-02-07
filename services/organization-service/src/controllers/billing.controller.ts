import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getPrismaClient } from '@collab/database';
import { config } from '../config';
// @ts-ignore
import { createLogger } from '@packages/logger';

const logger = createLogger('billing-controller');
const prisma = getPrismaClient();

if (!process.env.STRIPE_SECRET_KEY) {
    logger.error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

const PLANS = {
    'pro-monthly': {
        name: 'Pro',
        priceId: 'price_1QjXXXXXX' // TODO: Replace with real price ID or fetch dynamically
    },
    'team-monthly': {
        name: 'Team',
        priceId: 'price_1QjYYYYYY' // TODO: Replace with real price ID
    }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { organizationId, planId, successUrl, cancelUrl } = req.body;

        if (!organizationId || !planId) {
            return res.status(400).json({ error: 'Missing organizationId or planId' });
        }

        const organization = await prisma.organization.findUnique({
            where: { id: organizationId }
        });

        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        let customerId = organization.stripe_customer_id;

        // Create Stripe customer if not exists
        if (!customerId) {
            const customer = await stripe.customers.create({
                name: organization.name,
                metadata: {
                    organizationId: organization.id
                }
            });
            customerId = customer.id;

            await prisma.organization.update({
                where: { id: organizationId },
                data: { stripe_customer_id: customerId }
            });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: planId, // Assuming planId is the Stripe Price ID sent from frontend
                    quantity: 1,
                },
            ],
            metadata: {
                organizationId: organization.id
            },
            success_url: successUrl || `${config.clientUrl}/billing/success`, // Fallback
            cancel_url: cancelUrl || `${config.clientUrl}/billing/cancel`,
        });

        res.json({ sessionId: session.id, url: session.url });

    } catch (error: any) {
        logger.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) throw new Error('Missing Stripe signature or secret');
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        logger.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const organizationId = session.metadata?.organizationId;

                if (organizationId) {
                    await prisma.organization.update({
                        where: { id: organizationId },
                        data: {
                            subscription_status: 'active' as string,
                            // We ideally fetch subscription details to get plan info
                        }
                    });
                    logger.info(`Subscription activated for org ${organizationId}`);
                }
                break;
            }
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                // Find org by customer ID
                const org = await prisma.organization.findFirst({
                    where: { stripe_customer_id: customerId }
                });

                if (org) {
                    await prisma.organization.update({
                        where: { id: org.id },
                        data: {
                            subscription_status: subscription.status as string,
                            current_period_end: new Date((subscription as any).current_period_end * 1000)
                        }
                    });
                    logger.info(`Subscription updated for org ${org.id} to ${subscription.status} `);
                }
                break;
            }
        }
        res.json({ received: true });
    } catch (error) {
        logger.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};
