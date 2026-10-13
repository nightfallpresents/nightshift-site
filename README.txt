NIGHT SHIFT SITE: UPLOAD STEPS (Netlify)

1. Upload
   The text-signup popup runs on a small server function, and Netlify's drag-and-drop upload
   does NOT include functions. Use one of these instead:
     a) Netlify CLI: install Node, then in this folder run
          npx netlify-cli login
          npx netlify-cli deploy --prod
     b) Put this folder in a GitHub repo and connect it in Netlify (Add new project > Import from Git).
        Every push redeploys.
   Drag-and-drop still works for the pages themselves; without the function, the popup just
   sends people to the hosted Cymbal signup page instead.

2. Text signups (Cymbal)
   Project configuration > Environment variables > add:
     CYMBAL_API_KEY      your Cymbal partner API key (use a NEW key, the old one was shared in chat)
     CYMBAL_TAGS         optional, e.g. Night Shift   (the tag must already exist in Cymbal)
     CYMBAL_AUDIENCE_ID  optional, the audience number from Cymbal
   Then Deploys > Trigger deploy so the function picks them up.
   Until the key is set, the popup sends people to marketing.nightfallpresents.com/p/vxfm0noj instead.

3. Domain
   Domain management > Add a domain (e.g. nightshift.nightfallpresents.com) and follow Netlify's DNS steps.

4. Ticket links
   Open index.html, find "EDIT HERE" near the bottom. Paste each night's Posh link between the quotes:
     "2026-10-30": { posh: "https://posh.vip/e/...", tables: "", status: "", tablesOut: false },
   status: "low" shows ALMOST GONE, "soldout" shows SOLD OUT. tablesOut: true shows No tables.
   Nights cross themselves off at 6 AM the next morning.
   Redeploy after any edit (run the deploy command again, or push to GitHub).

5. Test after going live
   Open the site on your phone, wait for the popup, sign up with your own number,
   and check that you show up in Cymbal.

Short links that work: /faq  /contact
