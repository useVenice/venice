import type {NextApiRequest, NextApiResponse} from 'next'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  // https://github.com/stoplightio/elements
  res.status(200).send(`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Elements in HTML</title>
    <!-- Embed elements Elements via Web Component -->
    <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
  </head>
  <body>

    <elements-api
      apiDescriptionUrl="/api/v0/openapi.json"
      router="hash"
      layout="sidebar"
    />

  </body>
</html>
  `)
}
