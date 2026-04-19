# Human Input Needed

Configure these in Coolify environment variables:

## Required

### AUTH_SECRET
- Generate: openssl rand -base64 32
- Set AUTH_SECRET in Coolify before deploying

### NEXT_PUBLIC_APP_URL
- Set to your deployment domain

## Optional: Stripe (paid subscriptions)

- STRIPE_SECRET_KEY=sk_live_...
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
- STRIPE_WEBHOOK_SECRET=whsec_...
- WebHOok URL: https://yourdomain.com/api/webhooks/stripe
- Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted

## Optional: Resend (email reminders)

- RESEND_API_KEY=re_...
- EMAIL_FROM=noreply@yourdomain.com (verified domain in Resend)

## Optional: S3 Storage (receipt uploads)

- S3_ENDPOINT (aws S3 or compatible like Cloudflare R2, MinIO)
- S3_REGION
- S3_BUCKET
- S3_ACCESS_KEY_ID
- S3_SECRET_ACCESS_KEY

## Notes

- App runs without optional credentials
- Without Stripe: no payment processing (upgrade prompts shown)
- Without Resend: email reminders silently skipped
- Without S3: receipt uploads fail gracefully
- SQLite auto-initializes at /data/app.db on first start