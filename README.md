# Parent demo experience
This is an interactive React demo of the parent-facing Famly app. It's front-end only with local state.
It’s designed to give childcare center managers a quick glimpse of the parent experience while trialing Famly, without requiring them to download the mobile app or switch contexts. The demo mirrors the real parent interface as closely as possible, reflecting the current date to keep it relatable and up to date, and provides a realistic look into how families interact with Famly. It is also meant to help owners understand the collaborative and social value Famly can bring into their day-to-day life.

## Getting started

> **Prerequisites:**
> The following steps require [NodeJS](https://nodejs.org/en/) to be installed on your system, so please
> install it beforehand if you haven't already.

To get started with your project, you'll first need to install the dependencies with:

```
npm install
```

Then, you'll be able to run a development version of the project with:

```
npm run dev
```

After a few seconds, your project should be accessible at the address
[http://localhost:5173/](http://localhost:5173/)


If you are satisfied with the result, you can finally build the project for release with:

```
npm run build
```

## Deployment on S3

The demo can be deployed as a static site to Amazon S3. The production bucket is:  
[https://s3.eu-central-1.amazonaws.com/app-tryfamly.co/parent-demo-experience/index.html](https://s3.eu-central-1.amazonaws.com/app-tryfamly.co/parent-demo-experience/index.html)

To deploy:

1. Build the project:
    ```
    npm run build
    ```
    This outputs static files to the `dist/` directory.

2. Upload the contents of `dist/` to the S3 bucket. You can use the AWS CLI:
    ```
    aws s3 sync --acl public-read dist/ s3://app-tryfamly.co/parent-demo-experience/
    ```

3. Ensure the bucket is configured for static website hosting and that the correct permissions are set for public access.

After upload, the demo will be available at the S3 bucket URL above.

### CLI Deployment

You have to perform step 1-3 only once, then deploy with step 4.

1. Make sure you have the AWS CLI v2 installed.
2. Run the following command to configure SSO for your AWS CLI profile:

   ```bash
   aws configure sso
   ```

3. When prompted, enter:
   - SSO session name (Recommended): Famly Start
   - SSO Start URL: `https://famly.awsapps.com/start`
   - SSO Region: `eu-central-1`
   - SSO Account ID: `849294456676`
   - SSO Registration scopes: `sso:account:access`
   - It will open browser - authorize it
   - Select: `AWSPowerUserAccess`
   - CLI default client Region: None
   - CLI default output format: None
   - CLI profile name: `AWSPowerUserAccess-849294456676`

4. Deploy:

   ```bash
   aws sso login --profile AWSPowerUserAccess-849294456676
   aws s3 sync --profile AWSPowerUserAccess-849294456676 --acl public-read dist/ s3://app-tryfamly.co/parent-demo-experience/
   ```

### Features included
- Newsfeed
- Child profile
- Messages
- Notifications
- Payments
- Activity plans
### Highlights
- **Interactive newsfeed**: Likes, emoji reactions, and comments via `InteractivePost` and `EmojiReactionPicker`.
- **Rich posts**: Photo and news posts (`PhotoPostSection`, `NewsPostSection`, `PostFeedSection`).
- **Child profile**: Tabs for About, Photos, Activity Feed, and Family pages with a profile header (`ChildProfile` and subcomponents).
- **Messaging**: Conversation list and chat threads (`Messages`, `Chat`).
- **Notifications**: Parent-facing notification list.
- **Payments**: Balance overview, invoices, and a mocked payment modal (`Balance`, `Invoice`, `PaymentModal`).
- **Activity plans**: Preview upcoming activities from a library.
- **Extras**: RSVP example, Account Settings, Toasts, device frame wrapper, and demo header.
### Tech Stack
- **React 18** + **Vite 6**
- **Tailwind CSS** + `tailwindcss-animate`
- **shadcn/ui**-style primitives (Radix UI: Avatar, Dialog, Slot)
- **Framer Motion** for interaction polish

