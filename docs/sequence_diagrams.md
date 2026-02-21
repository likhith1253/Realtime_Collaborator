# Sequence Diagrams

These Sequence Diagrams detail the synchronous and asynchronous execution flows across the microservice cluster.

## 1. Real-Time Collaborative Editing Sequence

This diagram captures the flow of peer-to-peer differential syncing when User A modifies a document currently being viewed by User B.

![Real-Time Sequence Flow](images/collaboration_sequence.md)

## 2. Context-Aware AI Execution

When a user requests assistance from the AI (Gemini), the request is intercepted by the frontend, augmented with surrounding context block data, and securely proxies through the gateway to the Python AI service.

![AI Request Sequence Flow](images/ai_request_flow.md)

## 3. Stripe Checkout and Webhook Verification

This sequence demonstrates an Organization Admin initiating a subscription upgrade, transitioning them from a Free tier to an active payment status securely via Stripe webhooks.

![Stripe Sequence Flow](images/payment_flow_diagram.md)
