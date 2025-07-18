# Payload Utils

A collection of reusable utilities for [Payload CMS](https://payloadcms.com/), commonly shared across multiple projects — including, but not limited to, those developed at RIVEO.

## Features

### Fields

Preconfigured field definitions ready to use in collections or globals:

- **`internalTitleField`** – Simple text field that auto-generates an internal title (e.g. for admin display) based on another field's value.
- **`linkField`** – Field matching the internal link structure used by Payload’s Rich Text Editor.
- **`seoField`** – Minimal SEO field with `title`, `description`, and `image`.
- **`slugField`** – Slug (URL path) field with support for auto-generation from other fields.

### Plugins

- **`riveoUtilsPlugin`** – Registers translations and applies shared Payload configurations.
- **`s3StoragePlugin`** – Preconfigured S3 storage adapter for file uploads.

### Utilities

- **`groupContentTypes`** – Organize collections or globals into admin groups at the config level.

  **Example usage:**

  ```ts
  collections: groupContentTypes<CollectionConfig>(
    {
      group: 'Content',
      items: [Pages, Media],
    },
    Users,
  );
  ```

## Installation

```shell
npm install @riveo/payload-utils
```

## License

This project is licensed under the [MIT License](./LICENSE.md).
