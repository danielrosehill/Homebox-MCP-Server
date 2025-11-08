# Homebox MCP API Coverage Analysis

## Executive Summary

This document analyzes the current MCP server implementation against the full Homebox API (64 endpoints across 14 resource categories) to identify:
- Currently implemented functionality
- Missing functionality that would enhance the MCP
- Potential improvements to existing implementations

**Current Coverage**: 11 tools covering ~17% of available API endpoints (11 of 64 endpoints)

## Current Implementation

### Implemented Tools (11)

1. **list_items** - GET /v1/items (with filtering)
2. **get_item** - GET /v1/items/{id}
3. **create_item** - POST /v1/items
4. **update_item** - PUT /v1/items/{id}
5. **delete_item** - DELETE /v1/items/{id}
6. **list_locations** - GET /v1/locations
7. **create_location** - POST /v1/locations
8. **list_labels** - GET /v1/labels
9. **create_label** - POST /v1/labels
10. **search_items** - GET /v1/items?q=...
11. **get_item_link** - GET /v1/items?q=... (wrapper for link generation)
12. **set_item_parent** - PUT /v1/items/{id} (specialized wrapper)
13. **remove_item_parent** - PUT /v1/items/{id} (specialized wrapper)
14. **add_item_field** - PUT /v1/items/{id} (custom fields management)
15. **remove_item_field** - PUT /v1/items/{id} (custom fields management)

### Strengths of Current Implementation

- Solid authentication flow with token refresh
- Good handling of parent-child relationships
- Custom field management
- Helpful URL generation for web access (LAN/WAN support)
- Comprehensive formatting of responses with clickable links
- Asset ID search with # prefix intelligence

---

## Missing Functionality by Priority

### HIGH PRIORITY - Core Features

#### 1. **Item Attachments** (4 endpoints)
Missing all attachment functionality:
- POST /v1/items/{id}/attachments - Upload files to items
- GET /v1/items/{id}/attachments/{attachment_id} - Download attachments
- PUT /v1/items/{id}/attachments/{attachment_id} - Update attachment metadata
- DELETE /v1/items/{id}/attachments/{attachment_id} - Remove attachments

**Why Important**: Attachments are essential for inventory management (receipts, manuals, photos)

**Suggested Tools**:
```
- attach_file_to_item
- get_item_attachments
- delete_item_attachment
- update_item_attachment
```

#### 2. **Location Management** (Missing 4 of 6 endpoints)
Currently only have list and create:
- GET /v1/locations/{id} - Get specific location details
- PUT /v1/locations/{id} - Update location
- DELETE /v1/locations/{id} - Delete location
- GET /v1/locations/tree - Get hierarchical location tree

**Why Important**: Need full CRUD for locations, tree view is valuable for nested locations

**Suggested Tools**:
```
- get_location
- update_location
- delete_location
- get_locations_tree
```

#### 3. **Label Management** (Missing 3 of 5 endpoints)
Currently only have list and create:
- GET /v1/labels/{id} - Get specific label
- PUT /v1/labels/{id} - Update label
- DELETE /v1/labels/{id} - Delete label

**Why Important**: Need full CRUD for label management

**Suggested Tools**:
```
- get_label
- update_label
- delete_label
```

#### 4. **Item Import/Export** (2 endpoints)
- GET /v1/items/export - Export items to CSV/JSON
- POST /v1/items/import - Import items from CSV

**Why Important**: Bulk operations, backup, migration

**Suggested Tools**:
```
- export_items
- import_items
```

#### 5. **Asset ID Lookup** (1 endpoint)
- GET /v1/assets/{id} - Direct lookup by asset ID

**Why Important**: More efficient than search when you have asset ID

**Suggested Tools**:
```
- get_item_by_asset_id
```

---

### MEDIUM PRIORITY - Enhanced Features

#### 6. **Item Maintenance** (5 endpoints)
Complete maintenance tracking system:
- GET /v1/items/{id}/maintenance - Get maintenance log for item
- POST /v1/items/{id}/maintenance - Create maintenance entry
- GET /v1/maintenance - Query all maintenance
- PUT /v1/maintenance/{id} - Update maintenance entry
- DELETE /v1/maintenance/{id} - Delete maintenance entry

**Why Important**: Track service history, warranties, repairs

**Suggested Tools**:
```
- get_item_maintenance
- add_maintenance_entry
- list_all_maintenance
- update_maintenance_entry
- delete_maintenance_entry
```

#### 7. **Item Path** (1 endpoint)
- GET /v1/items/{id}/path - Get full hierarchical path of item

**Why Important**: Useful for understanding item location in nested structures

**Suggested Tools**:
```
- get_item_path
```

#### 8. **Item Duplication** (1 endpoint)
- POST /v1/items/{id}/duplicate - Duplicate an item

**Why Important**: Quick way to create similar items

**Suggested Tools**:
```
- duplicate_item
```

#### 9. **Custom Fields Discovery** (2 endpoints)
- GET /v1/items/fields - Get all custom field names used
- GET /v1/items/fields/values - Get all custom field values

**Why Important**: Discover what custom fields exist across inventory

**Suggested Tools**:
```
- list_custom_field_names
- list_custom_field_values
```

---

### LOW PRIORITY - Utility & Admin Features

#### 10. **Statistics & Reporting** (5 endpoints)
- GET /v1/groups/statistics - Overall group stats
- GET /v1/groups/statistics/labels - Label usage stats
- GET /v1/groups/statistics/locations - Location usage stats
- GET /v1/groups/statistics/purchase-price - Purchase price analytics
- GET /v1/reporting/bill-of-materials - BOM export

**Why Important**: Analytics and reporting for inventory value, organization

**Suggested Tools**:
```
- get_inventory_statistics
- get_label_statistics
- get_location_statistics
- get_purchase_price_statistics
- export_bill_of_materials
```

#### 11. **Label Maker** (3 endpoints)
- GET /v1/labelmaker/item/{id} - Generate printable item label
- GET /v1/labelmaker/assets/{id} - Generate printable asset label
- GET /v1/labelmaker/location/{id} - Generate printable location label

**Why Important**: Physical label printing for organization

**Suggested Tools**:
```
- generate_item_label
- generate_asset_label
- generate_location_label
```

#### 12. **Notifiers** (5 endpoints)
- GET /v1/notifiers - List notifiers
- POST /v1/notifiers - Create notifier
- PUT /v1/notifiers/{id} - Update notifier
- DELETE /v1/notifiers/{id} - Delete notifier
- POST /v1/notifiers/test - Test notifier

**Why Important**: Configure alerts for maintenance, warranties, etc.

**Suggested Tools**:
```
- list_notifiers
- create_notifier
- update_notifier
- delete_notifier
- test_notifier
```

#### 13. **Group Management** (4 endpoints)
- GET /v1/groups - Get group info
- PUT /v1/groups - Update group settings
- POST /v1/groups/invitations - Create group invitation

**Why Important**: Multi-user environment management

**Suggested Tools**:
```
- get_group_info
- update_group_settings
- create_group_invitation
```

#### 14. **System Actions** (5 endpoints)
Administrative maintenance operations:
- POST /v1/actions/ensure-asset-ids - Ensure all items have asset IDs
- POST /v1/actions/ensure-import-refs - Fix import references
- POST /v1/actions/zero-item-time-fields - Reset time fields
- POST /v1/actions/create-missing-thumbnails - Generate thumbnails
- POST /v1/actions/set-primary-photos - Set primary photos

**Why Important**: Data integrity and maintenance

**Suggested Tools**:
```
- ensure_asset_ids
- ensure_import_refs
- reset_time_fields
- generate_thumbnails
- set_primary_photos
```

#### 15. **Utilities** (4 endpoints)
- GET /v1/status - Application info/health
- GET /v1/currency - Get currency info
- GET /v1/qrcode - Generate QR code
- GET /v1/products/search-from-barcode - Barcode product search

**Why Important**: Utility functions for QR codes, product lookup

**Suggested Tools**:
```
- get_system_status
- get_currency_info
- generate_qr_code
- search_product_by_barcode
```

#### 16. **User Management** (5 endpoints - beyond login/refresh)
- GET /v1/users/self - Get current user info
- PUT /v1/users/self - Update account
- DELETE /v1/users/self - Delete account
- PUT /v1/users/change-password - Change password

**Why Important**: User account management

**Note**: Registration/login already handled by auth flow

**Suggested Tools**:
```
- get_user_profile
- update_user_profile
- change_password
```

---

## Improvements to Existing Implementation

### 1. **update_item Tool**
**Current**: Uses PUT with full object reconstruction
**API Also Supports**: PATCH /v1/items/{id}

**Suggestion**: Consider adding a `patch_item` tool for partial updates without needing to GET first, or modify `update_item` to use PATCH instead of PUT for efficiency.

### 2. **list_locations Tool**
**Current**: Basic listing
**Missing**: Location details like item counts, parent relationships

**Suggestion**: Enhance response formatting similar to items (show hierarchy, item counts)

### 3. **list_labels Tool**
**Current**: Returns raw JSON
**Missing**: Formatted output like items/locations

**Suggestion**: Add `formatLabelsList()` helper function for consistency

### 4. **Error Handling**
**Current**: Generic error messages
**Suggestion**: Add more specific error handling for common cases:
- 404 Not Found (item/location/label doesn't exist)
- 400 Bad Request (validation errors)
- 409 Conflict (duplicate names, circular parent references)

### 5. **Pagination**
**Current**: Supports page/pageSize for items
**Missing**: Total count, hasMore indicators in responses

**Suggestion**: Include pagination metadata in formatted responses

### 6. **Field Validation**
**Current**: Relies on API validation
**Suggestion**: Add client-side validation for:
- Character limits (name: 255, description: 1000, notes: 1000)
- UUID format validation for IDs
- Required fields

---

## Recommended Implementation Roadmap

### Phase 1: Core Completions (High Priority)
1. Item attachments (4 tools)
2. Complete location CRUD (4 tools)
3. Complete label CRUD (3 tools)
4. Asset ID direct lookup (1 tool)
5. Import/export (2 tools)

**Total: 14 new tools**

### Phase 2: Enhanced Features (Medium Priority)
1. Maintenance tracking (5 tools)
2. Item path/duplication (2 tools)
3. Custom fields discovery (2 tools)

**Total: 9 new tools**

### Phase 3: Analytics & Utilities (Low Priority)
1. Statistics/reporting (5 tools)
2. Label maker (3 tools)
3. Utilities (4 tools)

**Total: 12 new tools**

### Phase 4: Admin & Multi-user (Optional)
1. Notifiers (5 tools)
2. Group management (3 tools)
3. System actions (5 tools)
4. User management (3 tools)

**Total: 16 new tools**

---

## Special Considerations

### Attachment Handling
Attachments will require special handling for file uploads/downloads:
- Need to handle multipart/form-data for uploads
- Need to stream/buffer file downloads
- Consider file size limits and types

### Import/Export
- CSV parsing/generation
- Field mapping
- Error handling for malformed data
- Progress indicators for large imports

### Statistics/Reporting
- May return large datasets
- Consider pagination or filtering options
- Format for readability

### Authentication Scope
Current implementation uses user credentials. Some features (group management, user management) may require admin privileges - add checks or documentation.

---

## Conclusion

The current MCP implementation provides solid core functionality for item, location, and label management. The most impactful additions would be:

1. **Attachments** - Critical for real-world inventory use
2. **Full CRUD for locations/labels** - Complete the basic resource management
3. **Import/Export** - Enable bulk operations
4. **Maintenance tracking** - Add value for long-term asset management
5. **Statistics** - Provide insights into inventory

Implementing Phase 1 (14 tools) would bring coverage to ~40% of API endpoints and cover most common use cases. Phase 2 (9 tools) would reach ~50% and add significant value features.
