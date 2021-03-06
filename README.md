## Healthcheck Proxy POC

Start server with `npm run bridge`

Requests to `http://localhost:8000/pantheon/health` will be handled by Express.

All other requests will be routed to the JS Framework of choice (NextJS in this case.) `http://localhost:8000/` and `http://localhost:8000/api/hello` should be valid routes.

Note: the this POC currently runs Next in dev mode for demo purposes.

Open Questions / Issues:
* How do we determine the correct scripts to use as part of the above command? https://github.com/netlify/build-info perhaps?
* What is the correct way to include this script in the build? Wondering if the least disruptive way would be a subdirectory that has a separate set of node dependencies. This would require adjustments to how we're identifying the framework here (might not be much of an issue if that info exists in envars.)

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
