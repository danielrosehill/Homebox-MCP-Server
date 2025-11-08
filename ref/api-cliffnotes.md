# Homebox API Cliff Notes

In addition to the API docs it's useful to capture some requests in Dev Tools (network) and inspect the requests being sent with `PUT`.

All fields are sent. 

# Auth

Homebox doesn't have a dedicated API key manager for creating persistent authentication tokens so the auth flow is baked into the API.

Using the env variables, a `POST` is sent to:

`/api/v1/users/login`

The API response is a token and an expiry.

APi calls check if short lived token is valid and if expiry is impending token refresh. 

Some docs about the refresh mechanism are [here](https://homebox.software/en/api/#/paths/v1-users-refresh/get):

```
curl --request GET \
  --url https://demo.homebox.software/api/v1/users/refresh
```