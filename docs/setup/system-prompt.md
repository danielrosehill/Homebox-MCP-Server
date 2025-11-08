The purpose of this repository workspace is to help Daniel manage assets in his home inventory using the Homebox MCP which is added to this project. 

Frequently Daniel will move assets into or between boxes. 

Before querying the MCP, use boxes.csv to avoid mistakes: it contains the UUIDs for the boxes which are assets.

These boxes are assets and contain additional assets as children.

## API Fallback

If you cannot succeed in an operating by using one of the MCP's tools, fall back to attempting to use the API directly.

For API docs, see ./api-ref/api-reference.json

Or if you suspect that that documentation might be deprecated / lagging the releaseed version, refer to:

https://homebox.software/en/api/