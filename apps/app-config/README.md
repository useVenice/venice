
# Environment variables

| Name                              | Description                                                                                                                                                                                                          |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`             | Fully qualified url your venice api used for webhooks and server-side rendering.</br>Normally this is $SERVER_HOSTNAME/api. e.g. https://connect.example.com/api                                                     |
| `POSTGRES_URL`                    | Primary database used for metadata and user data storage                                                                                                                                                             |
| `JWT_SECRET_OR_PUBLIC_KEY`        | Used for validating authenticity of accessToken                                                                                                                                                                      |
| `int_plaid__clientId`             | <Required>                                                                                                                                                                                                           |
| `int_plaid__secrets__sandbox`     | <Required>                                                                                                                                                                                                           |
| `int_plaid__secrets__development` | <Required>                                                                                                                                                                                                           |
| `int_plaid__secrets__production`  | <Required>                                                                                                                                                                                                           |
| `int_plaid__clientName`           | <Required> The name of your application, as it should be displayed in Link.</br>Maximum length of 30 characters.</br>If a value longer than 30 characters is provided, Link will display "This Application" instead. |

