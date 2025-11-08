#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, "../.env"), override: true });

// API Configuration
const HOMEBOX_LOCAL_URL = process.env.HOMEBOX_LOCAL_URL || "http://10.0.0.4:7745";
const HOMEBOX_WAN_URL = process.env.HOMEBOX_WAN_URL?.trim(); // Trim whitespace and treat empty as undefined
const USE_LAN_API = process.env.USE_LAN_API !== "false"; // Default true
const LAN_LINKS = process.env.LAN_LINKS === "true"; // Default false

// Determine which URL to use for API calls
// By default, use LAN for API (faster), but can be configured to use WAN
const HOMEBOX_API_URL = USE_LAN_API ? HOMEBOX_LOCAL_URL : (HOMEBOX_WAN_URL || HOMEBOX_LOCAL_URL);
const HOMEBOX_API_BASE = `${HOMEBOX_API_URL}/api`;

// Determine which URL to use for web links
// By default, use WAN if available, otherwise LAN
// Can be overridden with LAN_LINKS=true to force LAN links
let HOMEBOX_WEB_URL: string;
let urlMode: string;

if (LAN_LINKS) {
  HOMEBOX_WEB_URL = HOMEBOX_LOCAL_URL;
  urlMode = "local (LAN_LINKS=true)";
} else if (HOMEBOX_WAN_URL && HOMEBOX_WAN_URL.length > 0) {
  HOMEBOX_WEB_URL = HOMEBOX_WAN_URL;
  urlMode = "wan (WAN URL provided)";
} else {
  HOMEBOX_WEB_URL = HOMEBOX_LOCAL_URL;
  urlMode = "local (no WAN URL)";
}

const HOMEBOX_USERNAME = process.env.HOMEBOX_USERNAME;
const HOMEBOX_PASSWORD = process.env.HOMEBOX_PASSWORD;

if (!HOMEBOX_USERNAME || !HOMEBOX_PASSWORD) {
  console.error("Error: HOMEBOX_USERNAME and HOMEBOX_PASSWORD environment variables are required");
  process.exit(1);
}

console.error(`Using API URL: ${HOMEBOX_API_URL} (USE_LAN_API=${USE_LAN_API})`);
console.error(`Using Web URL for links: ${HOMEBOX_WEB_URL} (${urlMode})`);

// Token management
let accessToken: string | null = null;
let tokenExpiry: Date | null = null;

// Login to Homebox and get access token
async function login(): Promise<void> {
  const url = `${HOMEBOX_API_BASE}/v1/users/login`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: HOMEBOX_USERNAME,
      password: HOMEBOX_PASSWORD,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Login failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  // Remove "Bearer " prefix if present since we add it ourselves
  accessToken = data.token.replace(/^Bearer\s+/i, '');

  // Parse expiry time if provided
  if (data.expiresAt) {
    tokenExpiry = new Date(data.expiresAt);
  } else {
    // Default to 24 hours if no expiry provided
    tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  console.error(`Logged in successfully. Token expires at: ${tokenExpiry}`);
}

// Refresh the access token
async function refreshToken(): Promise<void> {
  const url = `${HOMEBOX_API_BASE}/v1/users/refresh`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    // If refresh fails, try logging in again
    console.error("Token refresh failed, attempting re-login...");
    await login();
    return;
  }

  const data = await response.json();
  // Remove "Bearer " prefix if present since we add it ourselves
  accessToken = data.token.replace(/^Bearer\s+/i, '');

  if (data.expiresAt) {
    tokenExpiry = new Date(data.expiresAt);
  } else {
    tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  console.error(`Token refreshed. New expiry: ${tokenExpiry}`);
}

// Ensure we have a valid token
async function ensureValidToken(): Promise<void> {
  if (!accessToken || !tokenExpiry) {
    await login();
    return;
  }

  // Refresh if token expires in less than 5 minutes
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
  if (tokenExpiry < fiveMinutesFromNow) {
    await refreshToken();
  }
}

// Helper function to generate web URLs for items and locations
function generateItemUrl(itemId: string): string {
  return `${HOMEBOX_WEB_URL}/item/${itemId}`;
}

function generateLocationUrl(locationId: string): string {
  return `${HOMEBOX_WEB_URL}/location/${locationId}`;
}

function generateLabelUrl(labelId: string): string {
  return `${HOMEBOX_WEB_URL}/label/${labelId}`;
}

// Helper function to format item response with URL
function formatItemResponse(item: any): string {
  const itemUrl = generateItemUrl(item.id);

  // Create a concise summary with the most important fields
  let summary = `Item: ${item.name}\n`;
  if (item.assetId) summary += `Asset ID: ${item.assetId}\n`;
  if (item.description) summary += `Description: ${item.description}\n`;
  if (item.quantity) summary += `Quantity: ${item.quantity}\n`;
  if (item.location?.name) summary += `Location: ${item.location.name}\n`;
  if (item.parent?.name) {
    const parentUrl = generateItemUrl(item.parent.id);
    summary += `Parent Item: ${item.parent.name} (🔗 ${parentUrl})\n`;
  }
  if (item.manufacturer) summary += `Manufacturer: ${item.manufacturer}\n`;
  if (item.modelNumber) summary += `Model: ${item.modelNumber}\n`;
  if (item.serialNumber) summary += `Serial: ${item.serialNumber}\n`;

  summary += `\n🔗 Direct Link: ${itemUrl}`;
  summary += `\n\nFull details:\n${JSON.stringify(item, null, 2)}`;

  return summary;
}

// Helper function to format location response with URL
function formatLocationResponse(location: any): string {
  const locationUrl = generateLocationUrl(location.id);

  let summary = `Location: ${location.name}\n`;
  if (location.description) summary += `Description: ${location.description}\n`;
  if (location.itemCount !== undefined) summary += `Items: ${location.itemCount}\n`;

  summary += `\n🔗 Direct Link: ${locationUrl}`;
  summary += `\n\nFull details:\n${JSON.stringify(location, null, 2)}`;

  return summary;
}

// Helper function to format items list with URLs
function formatItemsList(items: any[]): string {
  if (!items || items.length === 0) {
    return "No items found.";
  }

  const formattedItems = items.map(item => {
    const itemUrl = generateItemUrl(item.id);
    let line = `- ${item.name}`;
    if (item.assetId) line += ` (Asset ID: ${item.assetId})`;
    line += `\n  ID: ${item.id}`;
    if (item.location?.name) line += `\n  Location: ${item.location.name}`;
    if (item.parent?.name) {
      const parentUrl = generateItemUrl(item.parent.id);
      line += `\n  Parent: ${item.parent.name} (🔗 ${parentUrl})`;
    }
    line += `\n  🔗 Direct Link: ${itemUrl}`;
    return line;
  }).join('\n\n');

  return `Found ${items.length} item(s):\n\n${formattedItems}`;
}

// Helper function to format locations list with URLs
function formatLocationsList(locations: any[]): string {
  if (!locations || locations.length === 0) {
    return "No locations found.";
  }

  const formattedLocations = locations.map(location => {
    const locationUrl = generateLocationUrl(location.id);
    return `- ${location.name} (${location.itemCount || 0} items)\n  🔗 ${locationUrl}`;
  }).join('\n\n');

  return `Found ${locations.length} location(s):\n\n${formattedLocations}`;
}

// Helper function to format get_item_link response
function formatGetItemLinkResponse(result: any, originalQuery: string): any {
  if (!result.items || result.items.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `No items found matching "${originalQuery}". Please try a different search term.`,
        },
      ],
    };
  }

  // If exactly one match, return just the link
  if (result.items.length === 1) {
    const item = result.items[0];
    const itemUrl = generateItemUrl(item.id);

    let response = `✅ Found item: ${item.name}\n`;
    if (item.assetId) response += `Asset ID: ${item.assetId}\n`;
    if (item.location?.name) response += `Location: ${item.location.name}\n`;
    response += `\n🔗 DIRECT LINK: ${itemUrl}\n`;
    response += `\nYou can click or copy this link to view the item in Homebox.`;

    return {
      content: [
        {
          type: "text",
          text: response,
        },
      ],
    };
  }

  // Multiple matches - show all with links
  let response = `Found ${result.items.length} items matching "${originalQuery}":\n\n`;

  result.items.forEach((item: any, index: number) => {
    const itemUrl = generateItemUrl(item.id);
    response += `${index + 1}. ${item.name}`;
    if (item.assetId) response += ` (Asset ID: ${item.assetId})`;
    response += `\n   🔗 ${itemUrl}\n`;
    if (index < result.items.length - 1) response += `\n`;
  });

  response += `\nPlease specify which item you want, or use a more specific search term.`;

  return {
    content: [
      {
        type: "text",
        text: response,
      },
    ],
  };
}

// Helper function to make API requests
async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: any
): Promise<any> {
  await ensureValidToken();

  const url = `${HOMEBOX_API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API request failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

// Define the MCP server
const server = new Server(
  {
    name: "homebox-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
const tools: Tool[] = [
  {
    name: "list_items",
    description:
      "List inventory items from Homebox. Supports filtering by page number and location.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
        },
        pageSize: {
          type: "number",
          description: "Number of items per page (default: 50)",
        },
        locations: {
          type: "array",
          items: { type: "string" },
          description: "Filter by location IDs (UUIDs)",
        },
        labels: {
          type: "array",
          items: { type: "string" },
          description: "Filter by label IDs (UUIDs)",
        },
        q: {
          type: "string",
          description: "Search query to filter items",
        },
      },
    },
  },
  {
    name: "get_item",
    description: "Get detailed information about a specific inventory item by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Item ID (UUID)",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "create_item",
    description: "Create a new inventory item in Homebox",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Item name",
        },
        description: {
          type: "string",
          description: "Item description",
        },
        locationId: {
          type: "string",
          description: "Location ID (UUID) where the item is stored",
        },
        parentId: {
          type: "string",
          description: "Parent item ID (UUID) if this item belongs to another item (e.g., item in a box)",
        },
        labelIds: {
          type: "array",
          items: { type: "string" },
          description: "Array of label IDs (UUIDs) to associate with the item",
        },
        quantity: {
          type: "number",
          description: "Quantity of the item (default: 1)",
        },
        serialNumber: {
          type: "string",
          description: "Serial number of the item",
        },
        modelNumber: {
          type: "string",
          description: "Model number of the item",
        },
        manufacturer: {
          type: "string",
          description: "Manufacturer of the item",
        },
        notes: {
          type: "string",
          description: "Additional notes about the item",
        },
        purchasePrice: {
          type: "number",
          description: "Purchase price of the item",
        },
        soldPrice: {
          type: "number",
          description: "Sold price of the item",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "update_item",
    description: "Update an existing inventory item",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Item ID (UUID)",
        },
        name: {
          type: "string",
          description: "Item name",
        },
        description: {
          type: "string",
          description: "Item description",
        },
        locationId: {
          type: "string",
          description: "Location ID (UUID) where the item is stored",
        },
        parentId: {
          type: "string",
          description: "Parent item ID (UUID) if this item belongs to another item. Set to null to remove parent relationship.",
        },
        labelIds: {
          type: "array",
          items: { type: "string" },
          description: "Array of label IDs (UUIDs) to associate with the item",
        },
        quantity: {
          type: "number",
          description: "Quantity of the item",
        },
        serialNumber: {
          type: "string",
          description: "Serial number of the item",
        },
        modelNumber: {
          type: "string",
          description: "Model number of the item",
        },
        manufacturer: {
          type: "string",
          description: "Manufacturer of the item",
        },
        notes: {
          type: "string",
          description: "Additional notes about the item",
        },
        purchasePrice: {
          type: "number",
          description: "Purchase price of the item",
        },
        soldPrice: {
          type: "number",
          description: "Sold price of the item",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_item",
    description: "Delete an inventory item by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Item ID (UUID)",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_locations",
    description: "List all storage locations in Homebox",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "create_location",
    description: "Create a new storage location",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Location name",
        },
        description: {
          type: "string",
          description: "Location description",
        },
        parentId: {
          type: "string",
          description: "Parent location ID (UUID) for nested locations",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "list_labels",
    description: "List all labels/tags in Homebox",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "create_label",
    description: "Create a new label/tag",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Label name",
        },
        description: {
          type: "string",
          description: "Label description",
        },
        color: {
          type: "string",
          description: "Label color (hex code)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "search_items",
    description:
      "Search for items using a query string. Searches across item names, descriptions, and other fields.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query string",
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
        },
        pageSize: {
          type: "number",
          description: "Number of items per page (default: 50)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_item_link",
    description:
      "Get the direct link to an item by searching for it using asset ID, name, or description. This is the preferred tool when users ask for links to specific items. Returns the direct clickable URL.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query - can be asset ID (e.g., '003-168'), item name, or description",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "set_item_parent",
    description:
      "Set or change the parent item for an item. This creates a parent-child relationship where the item becomes a child of another item (e.g., putting an item inside a box).",
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "string",
          description: "The ID (UUID) of the item to set the parent for (the child item)",
        },
        parentId: {
          type: "string",
          description: "The ID (UUID) of the parent item that will contain this item",
        },
      },
      required: ["itemId", "parentId"],
    },
  },
  {
    name: "remove_item_parent",
    description:
      "Remove the parent relationship from an item. This makes the item no longer a child of another item.",
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "string",
          description: "The ID (UUID) of the item to remove the parent from",
        },
      },
      required: ["itemId"],
    },
  },
];

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error("Missing arguments");
  }

  try {
    switch (name) {
      case "list_items": {
        const params = new URLSearchParams();
        if (args.page) params.append("page", String(args.page));
        if (args.pageSize) params.append("pageSize", String(args.pageSize));
        if (args.q) params.append("q", String(args.q));
        if (args.locations && Array.isArray(args.locations)) {
          args.locations.forEach((loc: any) =>
            params.append("locations", String(loc))
          );
        }
        if (args.labels && Array.isArray(args.labels)) {
          args.labels.forEach((label: any) =>
            params.append("labels", String(label))
          );
        }

        const result = await apiRequest(
          `/v1/items?${params.toString()}`,
          "GET"
        );

        const formattedText = result.items
          ? formatItemsList(result.items)
          : JSON.stringify(result, null, 2);

        return {
          content: [
            {
              type: "text",
              text: formattedText,
            },
          ],
        };
      }

      case "get_item": {
        const result = await apiRequest(`/v1/items/${args.id}`, "GET");
        return {
          content: [
            {
              type: "text",
              text: formatItemResponse(result),
            },
          ],
        };
      }

      case "create_item": {
        const body: any = {
          name: String(args.name),
        };

        if (args.description) body.description = String(args.description);
        if (args.locationId) body.locationId = String(args.locationId);
        if (args.parentId) body.parentId = String(args.parentId);
        if (args.labelIds) body.labelIds = args.labelIds;
        if (args.quantity !== undefined) body.quantity = Number(args.quantity);
        if (args.serialNumber) body.serialNumber = String(args.serialNumber);
        if (args.modelNumber) body.modelNumber = String(args.modelNumber);
        if (args.manufacturer) body.manufacturer = String(args.manufacturer);
        if (args.notes) body.notes = String(args.notes);
        if (args.purchasePrice !== undefined)
          body.purchasePrice = Number(args.purchasePrice);
        if (args.soldPrice !== undefined) body.soldPrice = Number(args.soldPrice);

        const result = await apiRequest("/v1/items", "POST", body);
        return {
          content: [
            {
              type: "text",
              text: `Item created successfully!\n\n${formatItemResponse(result)}`,
            },
          ],
        };
      }

      case "update_item": {
        const itemId = String(args.id);
        const body: any = {};

        if (args.name) body.name = String(args.name);
        if (args.description) body.description = String(args.description);
        if (args.locationId) body.locationId = String(args.locationId);
        if (args.parentId !== undefined) {
          // Allow setting parentId to null to remove parent relationship
          body.parentId = args.parentId === null ? null : String(args.parentId);
        }
        if (args.labelIds) body.labelIds = args.labelIds;
        if (args.quantity !== undefined)
          body.quantity = Number(args.quantity);
        if (args.serialNumber)
          body.serialNumber = String(args.serialNumber);
        if (args.modelNumber) body.modelNumber = String(args.modelNumber);
        if (args.manufacturer)
          body.manufacturer = String(args.manufacturer);
        if (args.notes) body.notes = String(args.notes);
        if (args.purchasePrice !== undefined)
          body.purchasePrice = Number(args.purchasePrice);
        if (args.soldPrice !== undefined)
          body.soldPrice = Number(args.soldPrice);

        const result = await apiRequest(`/v1/items/${itemId}`, "PUT", body);
        return {
          content: [
            {
              type: "text",
              text: `Item updated successfully!\n\n${formatItemResponse(result)}`,
            },
          ],
        };
      }

      case "delete_item": {
        const itemId = String(args.id);
        await apiRequest(`/v1/items/${itemId}`, "DELETE");
        return {
          content: [
            {
              type: "text",
              text: `Item ${itemId} deleted successfully`,
            },
          ],
        };
      }

      case "list_locations": {
        const result = await apiRequest("/v1/locations", "GET");

        const formattedText = Array.isArray(result)
          ? formatLocationsList(result)
          : JSON.stringify(result, null, 2);

        return {
          content: [
            {
              type: "text",
              text: formattedText,
            },
          ],
        };
      }

      case "create_location": {
        const body: any = {
          name: String(args.name),
        };

        if (args.description) body.description = String(args.description);
        if (args.parentId) body.parentId = String(args.parentId);

        const result = await apiRequest("/v1/locations", "POST", body);
        return {
          content: [
            {
              type: "text",
              text: `Location created successfully!\n\n${formatLocationResponse(result)}`,
            },
          ],
        };
      }

      case "list_labels": {
        const result = await apiRequest("/v1/labels", "GET");
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_label": {
        const body: any = {
          name: String(args.name),
        };

        if (args.description) body.description = String(args.description);
        if (args.color) body.color = String(args.color);

        const result = await apiRequest("/v1/labels", "POST", body);
        return {
          content: [
            {
              type: "text",
              text: `Label created successfully:\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case "search_items": {
        let query = String(args.query);

        // If query looks like an asset ID (contains only digits, hyphens)
        // and doesn't already start with #, prefix with # for exact asset ID search
        const looksLikeAssetId = /^[\d-]+$/.test(query);
        if (looksLikeAssetId && !query.startsWith('#')) {
          query = '#' + query;
        }

        const params = new URLSearchParams();
        params.append("q", query);
        if (args.page) params.append("page", String(args.page));
        if (args.pageSize) params.append("pageSize", String(args.pageSize));

        const result = await apiRequest(
          `/v1/items?${params.toString()}`,
          "GET"
        );

        const formattedText = result.items
          ? formatItemsList(result.items)
          : JSON.stringify(result, null, 2);

        return {
          content: [
            {
              type: "text",
              text: formattedText,
            },
          ],
        };
      }

      case "get_item_link": {
        let query = String(args.query);
        const originalQuery = query;

        // If query looks like an asset ID (contains only digits, hyphens)
        // and doesn't already start with #, try prefixing with # for exact asset ID search
        const looksLikeAssetId = /^[\d-]+$/.test(query);

        // Try with # prefix first if it looks like an asset ID
        if (looksLikeAssetId && !query.startsWith('#')) {
          query = '#' + query;
        }

        const params = new URLSearchParams();
        params.append("q", query);
        params.append("pageSize", "5"); // Limit to 5 results

        const result = await apiRequest(
          `/v1/items?${params.toString()}`,
          "GET"
        );

        // If no results with #prefix and we added it, try without (fallback to text search)
        if ((!result.items || result.items.length === 0) && query.startsWith('#') && query !== originalQuery) {
          const paramsNoHash = new URLSearchParams();
          paramsNoHash.append("q", originalQuery); // Use original query without #
          paramsNoHash.append("pageSize", "5");

          const fallbackResult = await apiRequest(
            `/v1/items?${paramsNoHash.toString()}`,
            "GET"
          );

          return formatGetItemLinkResponse(fallbackResult, originalQuery);
        }

        return formatGetItemLinkResponse(result, originalQuery);
      }

      case "set_item_parent": {
        const itemId = String(args.itemId);
        const parentId = String(args.parentId);

        // Get the current item details first
        const currentItem = await apiRequest(`/v1/items/${itemId}`, "GET");

        // Update the item with the new parent
        const body = {
          name: currentItem.name, // Required field
          parentId: parentId,
        };

        const result = await apiRequest(`/v1/items/${itemId}`, "PUT", body);

        return {
          content: [
            {
              type: "text",
              text: `Parent relationship updated successfully!\n\n${formatItemResponse(result)}`,
            },
          ],
        };
      }

      case "remove_item_parent": {
        const itemId = String(args.itemId);

        // Get the current item details first
        const currentItem = await apiRequest(`/v1/items/${itemId}`, "GET");

        // Update the item with null parent
        const body = {
          name: currentItem.name, // Required field
          parentId: null,
        };

        const result = await apiRequest(`/v1/items/${itemId}`, "PUT", body);

        return {
          content: [
            {
              type: "text",
              text: `Parent relationship removed successfully!\n\n${formatItemResponse(result)}`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Homebox MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
