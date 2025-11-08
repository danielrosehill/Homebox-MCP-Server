# Notes 

Note: my Homebox instance uses Postgres.

## Asset Paths

Asset ID searches involve preprending hashtag.

Asset ID 5451 is the same as asset ID 005-451. The API handles matching:

http://10.0.0.4:7745/items?q=%235451

Note: at the database level, assets are 

## Asset Links

Individual assets links in Homebox are constructed as follows:

yourinstance/items/{uuid}

The `items` table in the database contains:

`id` and `assetId`