# Orders Email Lambda (DynamoDB Streams → Resend)

Self-contained AWS Lambda (ZIP upload) that listens to the `SC-Orders` DynamoDB Stream and sends:

- Customer order confirmation email
- Business new order notification email

This lambda is intentionally **separate** from the Next.js app code to avoid bundling Next.js dependencies.

## Build + Zip

From repo root:

```bash
cd lambda/orders-email
npm install
npm run typecheck
npm run zip
```

Output:

- `lambda/orders-email/dist/index.js`
- `lambda/orders-email/dist/index.js.map`
- `lambda/orders-email/dist/orders-email.zip`

The zip contains `index.js` at the root, so configure the Lambda handler as:

- **Handler:** `index.handler`

## Environment variables (Lambda)

Set these in the Lambda console:

- `RESEND_API_KEY` (required)
- `AWS_REGION=us-east-2`
- `DDB_ORDERS_TABLE=SC-Orders`
- `EMAIL_FROM=orders@saplingsites.com`

## DynamoDB Stream trigger

Attach this Lambda to the DynamoDB Stream for table:

- `SC-Orders`
- Stream view type: `NEW_IMAGE`

## IAM permissions (Lambda execution role)

Minimum permissions needed (documented; apply in AWS console/IAM):

### Read from stream

- `dynamodb:DescribeStream`
- `dynamodb:GetRecords`
- `dynamodb:GetShardIterator`
- `dynamodb:ListStreams`

Scope these to the **stream ARN** for `SC-Orders`.

### Update/Get items in table

- `dynamodb:UpdateItem`
- `dynamodb:GetItem`

Scope these to the **table ARN** for `SC-Orders`.

## Behavior details

- Processes **only** `INSERT` records (new orders).
- Unmarshalls `record.dynamodb.NewImage` (and `Keys` when present).
- Idempotency:
  1) Attempts to claim via conditional `UpdateItem`:
     - `ConditionExpression`: `attribute_not_exists(emailSentAt) AND attribute_not_exists(emailSendLockId)`
     - `SET emailSendLockId = uuid, emailSendLockAt = ISO timestamp`
  2) Sends 2 emails via Resend.
  3) On success: `SET emailSentAt = ISO timestamp` and `REMOVE emailSendLockId, emailSendLockAt`.
- Errors:
  - Uses `Promise.allSettled` so one bad record does not fail the whole batch.
  - Logs enough details to CloudWatch to confirm:
    - handler start (region/table/env)
    - record shape (eventName/newImage/keys)
    - extracted keys
    - claim result
    - Resend request + raw response + message id

