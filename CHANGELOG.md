# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-11-08

### Added
- **New tool: `set_item_parent`** - Dedicated tool for setting or changing parent-child item relationships. This makes it much easier to organize items hierarchically (e.g., putting items inside boxes or containers).
- **New tool: `remove_item_parent`** - Dedicated tool for removing parent relationships from items, making them standalone again.
- **Update scripts** - Added `update.sh` (Linux/macOS) and `update.bat` (Windows) for easy package updates from npm registry.

### Changed
- Improved parent-child relationship handling with dedicated tools instead of relying solely on the generic `update_item` tool.

### Fixed
- Fixed issues with parent item assignment by creating specialized tools that properly handle the parent relationship workflow.

## [1.0.0] - Initial Release

### Added
- Item management (list, get, create, update, delete, search)
- Location management (list, create)
- Label management (list, create)
- Parent-child item relationships support
- Flexible LAN/WAN URL configuration
- Automatic asset ID search with `#` prefix
- Direct item link generation
- Token-based authentication with automatic refresh
