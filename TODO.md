### Todo

- [ ] Add a specific "Travel" layout for blog posts － [inspiration](https://photos.paulstamatiou.com/new-zealand/wellington/)
  - [ ] Prefix headings with a "location" icon
  - [ ] Allow sidebar to be toggled on/off for better photo viewing
  - [ ] Add a travel intro card with location, short description, days, photos taken
  - [ ] Add a map to the travel layout
  - [ ] Create components for travel content
    - [ ] "Accomodation" card (Hotel name, location, \$\$\$ per night, nights, rating, review, optional photo, etc.)
    - [ ] "Food" card (Restaurant name, location, rating, review, etc.)
  - [ ] Autoplaying video component (for video content, auto loop, no sound, etc.)
  - [ ] "Other Spots" for other places visited in the same location (will require some additional frontmatter for location(s))
- [ ] Setup unit tests
  - [ ] Add Vitest
  - [ ] Write initial tests
- [ ] Blog Post Listing page
  - [ ] Complete initial layout
  - [x] Add pagination
  - [x] Add filtering by tags
  - [ ] Add sorting by date
- [ ] Add [microlink](https://github.com/microlinkhq/sdk) image previews for blog posts
- [ ] Landing Page
  - [ ] Add a hero section
  - [ ] Add a featured blog post section
  - [ ] Add a featured photo section
- [ ] Add enhancing UI features for mobile
- [ ] Add indexing for blog posts using Algolia
  - [ ] Add [kbar](https://github.com/timc1/kbar) to support search functionality
  - [ ] Add Blog post search functionality
  - [ ] Add photo search functionality (by tags or other metadata)
- [ ] Improve SEO
  - [ ] Add meta tags
  - [ ] Add sitemap
  - [ ] Add robots.txt
  - [ ] Add OG tags
  - [ ] Add Twitter tags

### In Progress

- [ ] Add global **header & footer**
  - [x] Add a global header
  - [ ] Add a global footer
- [x] Add "Tags" and "Featured Image" to Blog Post Layout
  - [x] Add tags to blog post layout
  - [ ] Add featured image to blog post layout

### Stretch Goals

- [ ] Add a **Photography page**
  - [ ] Add a masonry photo gallery for the landing page
  - [ ] Add search/filtering functionality for the photo gallery
  - [ ] Integrate with Algolia for photo search (by tags or other metadata such as location or date)
  - [ ] Add lightbox functionality for photos in the gallery
- [ ] Add a "Related Posts" section to blog posts
- [ ] Add a "Share" button to blog posts
- [ ] Improve image optimization using "large" and "small" image sizes
  - Facilicated by S3 Photo Management & Optimizer Tool
