# Meta app setup for the bulk uploader

The uploader at `/upload` creates real ads through Meta's Marketing API, which
means it needs a Meta developer app and a system user token. This is the part
everyone gets stuck on, so it is written out in order.

Budget about fifteen minutes the first time.

## 1. Create the app

1. Go to [developers.facebook.com](https://developers.facebook.com) and sign in
   with the Facebook account that administers the Business Manager.
2. **My Apps**, then **Create App**.
3. App type: **Business**.
4. Name it something you will recognise in a list, for example
   `GrowingOffers Uploader`.
5. On the next screen, connect it to the **Business Manager** that owns the ad
   account you are going to upload into. If you skip this you will be back here
   later.

## 2. Add the ads use case

In the app dashboard, add the **Create and manage ads** use case. This is what
makes the `ads_management` and `ads_read` permissions available to the app at
all.

## 3. Create a system user token

System user tokens do not expire with a person's session, which is why the
uploader uses one rather than a user token.

1. Open **business.facebook.com**, then **Business settings**.
2. **Users**, then **System users**, then **Add**. Give it a name and the
   **Admin** role.
3. **Add assets**: give the system user the **ad account** you will upload into
   and the **Facebook page** the ads will be published from, both with full
   control.
4. **Generate new token**. Pick the app you just created, then tick:
   - `ads_management`
   - `ads_read`
   - `business_management`
   - `pages_show_list`
5. Copy the token now. Meta will not show it again.

## 4. Add a privacy policy URL

App settings, **Basic**, **Privacy Policy URL**. The app cannot be published
without one. `https://growingoffers.com/privacy` already exists and is fine.

## 5. Publish the app

**This is the one that catches people.** In App settings, **Basic**, switch the
app from **Development** to **Live**.

An app in development mode can read your campaigns and your ad accounts, so
everything on the Settings page will look like it is working. It cannot create
ads. The upload will get all the way to the launch and then fail on every
creative with a permissions error that does not mention development mode at
all.

If ads will not create and everything else works, come back and check this.

## 6. Paste the token into the uploader

1. Open `https://growingoffers.com/upload` and sign in with the admin password
   (`ADMIN_PASSWORD`, the same one as `/admin` and `/goals`).
2. Go to **Settings**.
3. Paste the token and save. The ad account and page lists fill in from Meta as
   soon as it is saved.
4. Pick the ad account and the page, then **Save settings**.

The token is stored server side in the project's Vercel Blob store and is never
sent back to the browser: after it is saved, the page only ever shows its last
eight characters.

## Troubleshooting

**The ad account or page list is empty.** The system user has not been given
that asset, or the token is missing `pages_show_list` / `ads_read`.

**Every creative fails with a permissions error.** The app is still in
development mode. See step 5.

**"Dynamic Creative ad sets only allow one ad".** That ad set has Dynamic
Creative switched on, which caps it at a single ad. Use **Create new ad set** in
step three of the wizard to copy its settings into a plain one.

**A video fails but the same creative as an image works.** Meta has to transcode
the video before it will accept a creative for it. The uploader waits for a
thumbnail, but a very long video can outlast that. Launch it again: the ads that
already went through are not recreated.

**WebP files.** Meta rejects them. The uploader converts WebP, BMP and TIFF to
JPEG on the way through, so there is nothing to do.
