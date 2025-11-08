# Homebox API Endpoints Reference

This document lists all available API endpoints in the Homebox API, organized by resource type.

## Items

Core inventory item management endpoints.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/items | GET | Query All Items |
| /v1/items | POST | Create Item |
| /v1/items/{id} | GET | Get Item |
| /v1/items/{id} | PUT | Update Item |
| /v1/items/{id} | PATCH | Update Item |
| /v1/items/{id} | DELETE | Delete Item |
| /v1/items/{id}/duplicate | POST | Duplicate Item |
| /v1/items/{id}/path | GET | Get the full path of an item |
| /v1/items/export | GET | Export Items |
| /v1/items/import | POST | Import Items |
| /v1/items/fields | GET | Get All Custom Field Names |
| /v1/items/fields/values | GET | Get All Custom Field Values |

## Item Attachments

Manage files and attachments associated with items.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/items/{id}/attachments | POST | Create Item Attachment |
| /v1/items/{id}/attachments/{attachment_id} | GET | Get Item Attachment |
| /v1/items/{id}/attachments/{attachment_id} | PUT | Update Item Attachment |
| /v1/items/{id}/attachments/{attachment_id} | DELETE | Delete Item Attachment |

## Item Maintenance

Track maintenance and service records for items.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/items/{id}/maintenance | GET | Get Maintenance Log |
| /v1/items/{id}/maintenance | POST | Create Maintenance Entry |
| /v1/maintenance | GET | Query All Maintenance |
| /v1/maintenance/{id} | PUT | Update Maintenance Entry |
| /v1/maintenance/{id} | DELETE | Delete Maintenance Entry |

## Locations

Manage storage locations and hierarchical location trees.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/locations | GET | Get All Locations |
| /v1/locations | POST | Create Location |
| /v1/locations/{id} | GET | Get Location |
| /v1/locations/{id} | PUT | Update Location |
| /v1/locations/{id} | DELETE | Delete Location |
| /v1/locations/tree | GET | Get Locations Tree |

## Labels

Manage tags and labels for organizing items.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/labels | GET | Get All Labels |
| /v1/labels | POST | Create Label |
| /v1/labels/{id} | GET | Get Label |
| /v1/labels/{id} | PUT | Update Label |
| /v1/labels/{id} | DELETE | Delete Label |

## Assets

Query items by their asset ID.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/assets/{id} | GET | Get Item by Asset ID |

## Groups

Manage group settings and invitations.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/groups | GET | Get Group |
| /v1/groups | PUT | Update Group |
| /v1/groups/invitations | POST | Create Group Invitation |

## Statistics & Reporting

Access analytics and generate reports.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/groups/statistics | GET | Get Group Statistics |
| /v1/groups/statistics/labels | GET | Get Label Statistics |
| /v1/groups/statistics/locations | GET | Get Location Statistics |
| /v1/groups/statistics/purchase-price | GET | Get Purchase Price Statistics |
| /v1/reporting/bill-of-materials | GET | Export Bill of Materials |

## Label Maker

Generate printable labels for items, assets, and locations.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/labelmaker/item/{id} | GET | Get Item label |
| /v1/labelmaker/assets/{id} | GET | Get Asset label |
| /v1/labelmaker/location/{id} | GET | Get Location label |

## Notifiers

Configure notification systems for alerts and updates.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/notifiers | GET | Get Notifiers |
| /v1/notifiers | POST | Create Notifier |
| /v1/notifiers/{id} | PUT | Update Notifier |
| /v1/notifiers/{id} | DELETE | Delete a Notifier |
| /v1/notifiers/test | POST | Test Notifier |

## Actions

System-level maintenance and data integrity operations.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/actions/ensure-asset-ids | POST | Ensure Asset IDs |
| /v1/actions/ensure-import-refs | POST | Ensures Import Refs |
| /v1/actions/zero-item-time-fields | POST | Zero Out Time Fields |
| /v1/actions/create-missing-thumbnails | POST | Create Missing Thumbnails |
| /v1/actions/set-primary-photos | POST | Set Primary Photos |

## Users

User authentication and account management.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/users/register | POST | Register New User |
| /v1/users/login | POST | User Login |
| /v1/users/logout | POST | User Logout |
| /v1/users/refresh | GET | User Token Refresh |
| /v1/users/self | GET | Get User Self |
| /v1/users/self | PUT | Update Account |
| /v1/users/self | DELETE | Delete Account |
| /v1/users/change-password | PUT | Change Password |

## Utilities

Miscellaneous utility endpoints.

| Endpoint | Method | Action |
|----------|--------|--------|
| /v1/status | GET | Application Info |
| /v1/currency | GET | Currency |
| /v1/qrcode | GET | Create QR Code |
| /v1/products/search-from-barcode | GET | Search EAN from Barcode |

## Summary

- **Total Endpoints**: 64
- **Resource Categories**:
  - Actions (5 endpoints)
  - Assets (1 endpoint)
  - Currency (1 endpoint)
  - Groups (4 endpoints)
  - Group Statistics (3 endpoints)
  - Items (12 endpoints)
  - Item Attachments (4 endpoints)
  - Item Maintenance (2 endpoints)
  - Item Path (1 endpoint)
  - Label Maker (3 endpoints)
  - Labels (5 endpoints)
  - Locations (6 endpoints)
  - Maintenance (3 endpoints)
  - Notifiers (5 endpoints)
  - Products (1 endpoint)
  - QR Code (1 endpoint)
  - Reporting (1 endpoint)
  - Status (1 endpoint)
  - Users (7 endpoints)
