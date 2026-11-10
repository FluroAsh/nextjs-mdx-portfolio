# Ashley Thompson's Portfolio

A modern, performant portfolio and blog built with Next.js 15, MDX, and Contentlayer. Features a custom design system, optimized image handling, and a focus on accessibility and user experience.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Content**: [Contentlayer 2](https://contentlayer.dev/) for type-safe MDX
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion successor)
- **Code Highlighting**: [Shiki](https://shiki.style/) via rehype-pretty-code
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- **Package Manager**: [Bun](https://bun.sh/) (recommended)

## 📦 Installation

This project uses **Bun** as the default package manager for faster installs and better compatibility with modern dependencies.

### Using Bun (Recommended)

```bash
# Install Bun if you haven't already
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start development server
bun run dev
```

### Using npm (Alternative)

If you prefer npm, note that [KBar](https://github.com/timc1/kbar) currently uses an old dependency (React Virtual) that doesn't support React 19. You'll need to use the `--legacy-peer-deps` flag:

```bash
npm install --legacy-peer-deps
npm run dev
```

> **Note**: There's a [pending fix](https://github.com/timc1/kbar/pull/348) for this issue, but it hasn't been merged yet. Using Bun eliminates this compatibility issue entirely.

## 🛠️ Development

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Build Contentlayer content only
bun run build:content


# Lint code
bun run lint

```

## 📁 Project Structure

```
.
├── blog/                   # MDX blog posts
│   ├── *.mdx               # Standalone posts
│   └── [series]/           # Series posts (eg. "japan-2025/tokyo.mdx")
├── contentlayer/           # Contentlayer configuration
│   ├── document-types.ts   # Content schemas
│   ├── plugins.ts          # Remark/Rehype plugins
│   └── utils.ts            # Content utilities
├── public/
│   └── static/             # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # Shared components
│   ├── features/           # Feature-specific components
│   ├── data/               # Site metadata & content
│   ├── lib/                # Utilities & helpers
│   └── css/                # Global styles
└── .cursor/
    └── rules/              # Cursor IDE rules & standards
```

## ✨ Features

### Content Management

- **Type-safe MDX**: Contentlayer provides full TypeScript support for frontmatter
- **Series Support**: Organize related posts into a series (eg. "japan-2025/tokyo.mdx", "japan-2025/osaka.mdx", etc.)
- **Table of Contents**: Auto-generated from content headings
- **Reading Time**: Calculated automatically
- **Tag System**: Filter posts by tags with pagination

### Image Handling

- **Responsive Images**: Automatic srcset generation with multiple sizes
- **Blur Placeholders**: LQIP (Low-Quality Image Placeholders) and sizes read from each image set's `manifest.json` on the CDN, so the build fails for a CDN image whose set has none
- **Lightbox**: Click to zoom on images
- **Captions**: Automatic caption support from alt text

Captions example:

```mdx
![Alt text](image.png)
_Caption text_

// Or MDX components can be used:

<LightboxImage src="image.png" alt="Alt text" caption="Caption text" />
```

**How Image Placeholders Work:**

1. The build reads the set's `manifest.json` for sizes and a base64 placeholder
2. Aspect ratio and orientation are calculated automatically
3. The placeholder is displayed while the full image loads
4. Images on other hosts render unmeasured, without a placeholder

### Developer Experience

- **Command Palette**: KBar integration for quick navigation
- **SEO**: Dynamic Open Graph tags for social sharing

## 🎨 Customization

### Site Metadata

Update site information in `src/data/site-metadata.ts`:

```typescript
export const siteMetaData = {
  title: "Your Name",
  description: "Your site description",
  siteUrl: "https://yoursite.com",
  // ... more config
};
```

### Author Information

Update author details in `src/data/author.ts`:

```typescript
export const author = {
  name: "Your Name",
  email: "you@example.com",
  // ... social links
};
```

### Styling

- **Colors**: Modify Tailwind config in `tailwind.config.ts`
- **Fonts**: Update font imports in `src/fonts/index.ts`
- **Components**: UI components use a combination of [Shadcn](https://ui.shadcn.com/) and custom components

## 📝 Writing Content

Create a new blog post in the `blog/` directory:

```mdx
---
title: "Your Post Title"
date: 2026-01-18
draft: false
description: "A short description for SEO and social sharing"
tags: ["tag1", "tag2"]
image: https://your-cdn.com/image.jpg
---

Your markdown/MDX content here...
```

For series posts, create a subdirectory:

```
blog/
└── my-series/
    ├── part-1.mdx
    ├── part-2.mdx
    └── part-3.mdx
```

And add series metadata to frontmatter:

```yaml
series: "My Series"
seriesTitle: "My Series"
seriesOrder: 1
```

## 🚢 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect Next.js and configure build settings
   - If using npm, ensure you have the `--legacy-peer-deps` flag set as your Next.js install command
4. Deploy!

### Environment Variables

Create a `.env` file in the root directory with the following required variables:

```bash
NEXT_PUBLIC_S3_HOSTNAME=image-domain.com
```

**Note**: `NEXT_PUBLIC_S3_HOSTNAME` is required for the responsive image components to work correctly. This should be the hostname of your S3 bucket, CDN or image delivery service (without the `https://` protocol).

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Contentlayer](https://contentlayer.dev/) for the amazing content layer
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework
- [Bun](https://bun.sh/) for blazing-fast package management

---

Built with ❤️ by [Ashley Thompson](https://www.ashleygthompson.com)
