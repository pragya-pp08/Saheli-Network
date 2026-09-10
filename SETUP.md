# Running the connected Saheli app

The existing visual design is retained. Screens now use an authenticated FastAPI API backed by Firestore, rather than the shared demo arrays. **The backend must be configured and running for authenticated pages to load.** The old browser-only Firestore data path is no longer used.

## 1. Firebase

Keep Email/Password sign-in enabled for the project configured in `src/firebase.js`. Add your deployed frontend domain to Firebase Authentication's authorized domains.

In Firebase Console → Project settings → Service accounts, obtain an Admin SDK service account file. Keep it outside the repository. Never put it in frontend code or paste its contents into chat.

Copy `backend/.env.example` to `backend/.env`, preserving any existing Gemini key. Set:

```dotenv
FIREBASE_PROJECT_ID=saheli-network-b633f
GOOGLE_APPLICATION_CREDENTIALS=C:/private/saheli-service-account.json
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

The service account needs access to this project's Firestore database and Firebase Authentication. Use the same Firebase project on frontend and backend.

Deploy the included `firestore.rules` to the chosen project before accepting real data. They deny browser access; the Admin SDK accesses the database through the API, which checks ownership. Example with an authenticated Firebase CLI:

```powershell
firebase deploy --only firestore:rules --project saheli-network-b633f
```

This repository change has **not** deployed those rules or changed your cloud settings. Review existing applications using the project before deploying restrictive rules.

## 2. Run locally

From the project root, one command starts both the React frontend and FastAPI backend:

```powershell
npm install
npm run dev
```

The site runs at `http://127.0.0.1:5173` and the API runs at `http://127.0.0.1:8000`. Keep this terminal open while using Saheli. Press `Ctrl+C` once to stop both servers.

If the backend virtual environment does not exist yet, prepare it once before running `npm run dev`:

```powershell
cd backend
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements.txt
cd ..
```

For deployment, set `VITE_API_URL` to the HTTPS backend URL when building the frontend and configure `ALLOWED_ORIGINS` accordingly.

## 3. Test the actual journey with two accounts

1. Register a worker using **Mujhe kaam chahiye**. Profile → Edit: save name, skills, area and goal. GPS is optional; manually entered areas are displayed without invented distances.
2. Use a separate browser session and register a customer using **Mujhe kaam karwana hai**. Open **Post & Manage Jobs** and add a real job.
3. Worker: apply. Refresh; the application remains saved and appears under Orders as pending.
4. Customer: Post & Manage Jobs → Select Worker. Exactly one worker can be assigned through a Firestore transaction.
5. Worker: Orders → Mark Completed. The amount appears as pending, **not received earnings**.
6. Customer: Pay Now. After verified capture, the worker's earnings and payment history update. A customer can review completed work.
7. Check the bell for saved application, assignment, completion and payment notifications. These are in-app notifications, not SMS, email or background push.
8. Check another account cannot access the order URL. Refresh each account and confirm saved values remain separate.

An account can switch between **Kaam Chahiye** and **Hire a Saheli** from the sidebar. The backend enforces the current mode: worker mode can browse/apply, while customer mode can post/select. An account's own posted jobs never appear in its worker opportunity list.

Photos are resized and stripped of metadata on the server. This initial implementation stores a small avatar and up to four compact portfolio photos privately in the profile document; a larger public portfolio needs object storage and access rules.

## 4. Universal UPI / QR checkout

The integration uses Razorpay Standard Checkout. Customers can use supported UPI apps; they do not need a Razorpay account. UPI intent is used on supported mobile browsers, while desktop checkout displays a QR code. Actual available methods depend on the merchant configuration and device. A personal PhonePe account does not provide the server callbacks needed to automatically verify payments.

The platform owner needs a merchant account. Start with test keys in `backend/.env`:

```dotenv
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

Configure automatic capture in the provider dashboard and an HTTPS webhook pointing to `/payments/webhook`. Subscribe to `payment.captured` and `refund.processed`; use the same webhook secret as the backend. Webhooks must be reachable from the provider, so localhost alone cannot receive them.

The server owns the amount, payment order ID and ledger status. It verifies the checkout HMAC, fetches the payment from the provider and only counts captured matching INR payments. Signed webhooks recover confirmation when the customer closes the page. Duplicate confirmations do not increment totals. Processed refunds reduce the net payment amounts in the earnings report; this is a net-by-original-payment-date report, not a separate refund-date cashflow report.

The QR/UPI intent experience requires the provider's supported live environment; test-mode UPI is simulated. See [Standard Checkout integration](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/) and [UPI Intent / QR behaviour](https://razorpay.com/docs/payments/payment-methods/upi/upi-intent/).

**Worker payouts are not implemented or enabled.** Current captured payments are collected into the platform merchant account. The displayed earnings are gross work receipts minus recorded refunds; gateway fees, taxes, commissions, transfers and bank settlement are not calculated. Do not enable live collection until worker payout routing, onboarding and reconciliation are implemented. Marketplace settlement requires a provider product such as [Route linked accounts](https://razorpay.com/docs/payments/route/linked-account/), not just a UPI ID field. The withdrawal placeholder was replaced with a disabled setup-pending control.

If payment creation is interrupted after the server claims it, it fails closed. An operator must reconcile the provider order by its receipt before clearing `paymentCreating`; do not blindly create another payment order or ask a customer to pay again. Automated reconciliation and operational tooling remain launch work.

## 5. AI and recovery

Preserve the existing `GEMINI_API_KEY` and set `GEMINI_MODEL` to a model available to that key. The backend builds its own profile/job context and does not trust client-supplied system prompts. It returns an unavailable message when unconfigured instead of leaking provider errors or credentials.

Recovery requests are private saved records. Saving a request does not promise a job, human support, benefits, or preferential customer selection. Actual crisis-response operations and expiry/closure workflows remain to be designed.

## Checks and remaining launch work

```powershell
npm run build
cd backend
.venv/Scripts/python.exe -m pytest tests -q
```

Offline tests exercise API contracts using an in-memory Firestore substitute: access control, new-user defaults, assignment, completion, payment signatures/capture, duplicate callbacks, refunds, notifications and photo validation. They do not prove Firestore contention/retries, live Firebase credentials, provider checkout, or bank settlement. Run the two-account journey against a staging Firebase project and provider test account before launch.

Still needed before public launch: staging integration checks; production Firestore rules deployment; worker payouts; cancellation/disputes and refund initiation; payment reconciliation tooling; admin verification/moderation; AI rate limits and abuse controls; pagination at scale; accessible/responsive testing of all authenticated screens. No identity verification badge is granted by the current implementation. Ratings are based only on saved reviews of completed orders.
