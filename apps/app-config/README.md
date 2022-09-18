
# Environment variables

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?env=NEXT_PUBLIC_SERVER_URL%2CPOSTGRES_URL%2CJWT_SECRET_OR_PUBLIC_KEY%2Cint_plaid__clientId%2Cint_plaid__secrets__sandbox%2Cint_plaid__secrets__development%2Cint_plaid__secrets__production%2Cint_plaid__clientName&envDescription=Not%20all%20values%20are%20required.%20Use%20empty%20space%20to%20skip%20values&envLink=https%3A%2F%2Fgithub.com%2Falkafinance%2Fledger-sync%2Fblob%2Fmain%2Fapps%2Fapp-config%2FREADME.md&project-name=my-ledger-sync&repository-url=https%3A%2F%2Fgithub.com%2Falkafinance%2Fledger-sync&root-directory=apps%2Fnext)

| Name                              | Description                                                                                                                                                                                               |
| :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SERVER_URL`          | Fully qualified url your venice next.js app used for redirects, webhooks and server-side rendering.</br>e.g. https://connect.example.com or http://localhost:3000 for development                         |
| `POSTGRES_URL`                    | Primary database used for metadata and user data storage                                                                                                                                                  |
| `JWT_SECRET_OR_PUBLIC_KEY`        | Used for validating authenticity of accessToken                                                                                                                                                           |
| `int_plaid__clientId`             |                                                                                                                                                                                                           |
| `int_plaid__secrets__sandbox`     | (Optional)                                                                                                                                                                                                |
| `int_plaid__secrets__development` | (Optional)                                                                                                                                                                                                |
| `int_plaid__secrets__production`  | (Optional)                                                                                                                                                                                                |
| `int_plaid__clientName`           | The name of your application, as it should be displayed in Link.</br>Maximum length of 30 characters.</br>If a value longer than 30 characters is provided, Link will display "This Application" instead. |

