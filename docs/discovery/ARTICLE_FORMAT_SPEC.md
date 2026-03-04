# Nogoth Blog Article Format Specification

**Version**: 1.0  
**Last Updated**: 2026-03-04  
**Status**: Established  

## Overview

Articles for the Nogoth blog are **Markdown files** with **YAML frontmatter**, stored in the `articles/` directory.

## File Structure

```
articles/
├── 2009-05-17-future-work.md
├── 2009-05-17-this-is-a-test.md
└── 2009-05-18-yaml-syck.md
```

## File Naming Convention

**Format**: `YYYY-MM-DD-title-slug.md`

**Components**:
- `YYYY-MM-DD`: Publication date (required, used for sorting)
- `title-slug`: URL-friendly article identifier (required, should match article topic)
- `.md`: Markdown file extension (required)

**Examples**:
```
2026-03-04-getting-started-with-vue.md
2026-03-01-react-performance-tips.md
2009-05-17-yaml-syck.md
```

**Rules**:
- Use lowercase letters only
- Use hyphens to separate words (no underscores or spaces)
- Keep slug concise but descriptive (2-4 words)
- Date must be valid and in YYYY-MM-DD format

## YAML Frontmatter

Every article **must** start with YAML frontmatter between `---` markers.

### Complete Example

```yaml
---
title: Understanding Vue.js Composition API
date: 2026-03-04
excerpt: A deep dive into Vue 3's Composition API and how to use it effectively
tags: [vue, javascript, composition-api, tutorial]
author: nogoth
---
```

### Field Specification

| Field | Required | Type | Length | Notes |
|-------|----------|------|--------|-------|
| `title` | ✅ Yes | string | 1-200 chars | Article headline |
| `date` | ✅ Yes | YYYY-MM-DD | 10 chars | Publication date |
| `excerpt` | ✅ Yes | string | 50-200 chars | Brief description for listings |
| `tags` | ❌ No | array | 0-10 items | Topic categories |
| `author` | ❌ No | string | 1-50 chars | Content creator (defaults to "nogoth") |

### Field Details

#### `title` (Required)
- **Type**: String
- **Length**: 1-200 characters (recommended 50-150)
- **Purpose**: Article headline, displayed in listings and article view
- **Examples**:
  ```yaml
  title: Getting Started with Vue.js
  title: This is a test
  title: YAML Syck
  ```
- **Notes**: 
  - Can include special characters and numbers
  - Will be displayed in normal case (CSS transforms have been removed)

#### `date` (Required)
- **Type**: ISO 8601 date string (YYYY-MM-DD)
- **Format**: `2026-03-04` (not `2026-3-4` or `03/04/2026`)
- **Purpose**: Article publication date, used for sorting (newest first)
- **Examples**:
  ```yaml
  date: 2026-03-04
  date: 2009-05-17
  ```
- **Notes**:
  - Must be valid date
  - Controls article order in sidebar (newest appears first)
  - Affects "reading time" calculation if markdown is updated

#### `excerpt` (Required)
- **Type**: String
- **Length**: 50-200 characters recommended
- **Purpose**: Preview text shown in article listings
- **Examples**:
  ```yaml
  excerpt: A deep dive into Vue 3's Composition API and how to use it effectively
  excerpt: Someone really needs to get a better jekyll generator.
  excerpt: Using yaml::syck for elegant option reading in Perl.
  ```
- **Notes**:
  - Displayed below article title in sidebar and listings
  - Good excerpts are compelling and informative
  - Will be truncated if longer than display allows

#### `tags` (Optional)
- **Type**: YAML array of strings
- **Format**: `[tag1, tag2, tag3]`
- **Length**: 0-10 tags per article (recommended 2-5)
- **Purpose**: Article categorization for filtering and discovery
- **Examples**:
  ```yaml
  tags: [vue, javascript, composition-api, tutorial]
  tags: [jekyll, tools, generators]
  tags: [perl, yaml, syck]
  ```
- **Notes**:
  - Tags are displayed on the article page
  - Used for tag-based filtering (future feature)
  - Should be lowercase and lowercase with hyphens
  - Single word tags preferred: `javascript` not `JS` or `java-script`
  - No punctuation in tags

#### `author` (Optional)
- **Type**: String
- **Length**: 1-50 characters
- **Default**: `nogoth`
- **Purpose**: Content creator attribution
- **Examples**:
  ```yaml
  author: nogoth
  author: Ben Livingood
  ```
- **Notes**:
  - Defaults to "nogoth" if not specified
  - Currently not displayed in UI but stored in metadata

## Content Section

**Everything after the closing `---`** is treated as article content in **Markdown format**.

### Example

```markdown
---
title: Article Title
date: 2026-03-04
excerpt: Brief description
tags: [tag1, tag2]
author: nogoth
---

# Article Title

Article content starts here. This is the first paragraph.

## Section Heading

More content in this section.

- Bullet point
- Another point

\`\`\`javascript
// Code example
const greeting = "Hello";
\`\`\`

[Link to resource](https://example.com)
```

## Markdown Support

The blog uses **marked.js** to render Markdown. Supported syntax:

### Headings
```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Text Formatting
```markdown
**bold text**
*italic text*
~~strikethrough~~
`inline code`
```

### Lists

**Unordered**:
```markdown
- Item 1
- Item 2
  - Nested item
  - Another nested
- Item 3
```

**Ordered**:
```markdown
1. First
2. Second
3. Third
   1. Nested first
   2. Nested second
```

### Links and Images
```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Title")

![Alt text](https://example.com/image.jpg)
![Alt text with title](https://example.com/image.jpg "Title")
```

### Code Blocks
```markdown
\`\`\`javascript
const greeting = "Hello, world!";
console.log(greeting);
\`\`\`

\`\`\`python
def hello():
    print("Hello, world!")
\`\`\`

\`\`\`ruby
puts "Hello, world!"
\`\`\`
```

**Supported languages**:
- `javascript` / `js`
- `typescript` / `ts`
- `python`
- `ruby`
- `perl`
- `bash` / `shell`
- `html`
- `css`
- `json`
- `yaml`
- And many more (any language marked.js supports)

### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
> 
> And have multiple paragraphs
```

### Horizontal Rule
```markdown
---
```

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

## Example Articles

### Minimal Article

```markdown
---
title: This is a test
date: 2009-05-17
excerpt: Someone really needs to get a better jekyll generator.
tags: [jekyll, tools, generators]
---

Someone really needs to get a better jekyll generator. Something that stubs up the skeletons and some of the files.
```

### Full-Featured Article

```markdown
---
title: Understanding Vue.js Composition API
date: 2026-03-04
excerpt: A deep dive into Vue 3's Composition API and how to use it effectively
tags: [vue, javascript, composition-api, tutorial]
author: nogoth
---

# Understanding Vue.js Composition API

The Composition API is a new way to organize code in Vue 3.

## Key Benefits

- **Code Reusability**: Share logic between components
- **Better Organization**: Related logic grouped together
- **TypeScript Support**: Full type safety

## Example: Simple Counter

\`\`\`typescript
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
\`\`\`

## Getting Started

Read the [official docs](https://vuejs.org/guide/extras/composition-api-faq.html).

---

Happy coding!
```

## Real Examples

### Article 1: Future Work

```markdown
---
title: Future work
date: 2009-05-17
excerpt: Game plan for the short term is to take yasnippets and craft up templates.
tags: [jekyll, tools, emacs]
author: nogoth
---

Game plan for the short term is to take yasnippets and craft up a template that i can use to make new entries in the blog as well as the dates that they are supposed to have as part of their name.

Of course then I'll have to post that project, if i can, to github for other people using jekyll to have at their fingertips.
```

### Article 2: YAML Syck

```markdown
---
title: Yaml::Syck
date: 2009-05-18
excerpt: Using yaml::syck for elegant option reading in Perl.
tags: [perl, yaml, syck]
author: nogoth
---

Actually to read options I'm going start using yaml::syck found here
http://search.cpan.org/~audreyt/YAML-Syck-1.07/lib/YAML/Syck.pm

It has a LoadFile message which would be much more elegant than my hack
```

## Common Patterns

### Article with Code Examples

```markdown
---
title: Getting Started with [Technology]
date: 2026-03-04
excerpt: Learn the basics of [Technology] from scratch.
tags: [technology, tutorial, beginner]
---

# Getting Started with [Technology]

[Introduction paragraph]

## Installation

\`\`\`bash
command to install
\`\`\`

## First Example

\`\`\`code-language
first code example
\`\`\`

## Conclusion

[Closing thoughts]
```

### Article with Multiple Sections

```markdown
---
title: Topic Analysis
date: 2026-03-04
excerpt: Understanding the nuances of [Topic].
tags: [topic, analysis]
---

# Topic Analysis

[Intro]

## Background

[History/context]

## Key Concepts

- Concept 1
- Concept 2
- Concept 3

## Deep Dive

### Subtopic 1
[Details]

### Subtopic 2
[Details]

## Conclusion

[Summary and takeaways]
```

## Validation Rules

When adding an article, ensure:

- ✅ File named `YYYY-MM-DD-slug.md`
- ✅ Valid YAML frontmatter with `---` delimiters
- ✅ `title` field present and non-empty
- ✅ `date` field in YYYY-MM-DD format
- ✅ `excerpt` field present (50-200 chars recommended)
- ✅ `tags` array valid if present (no duplicate tags)
- ✅ Content after frontmatter is valid Markdown
- ✅ No HTML injection or script tags (Markdown only)
- ✅ Code blocks properly enclosed in triple backticks
- ✅ Links properly formatted
- ✅ No trailing whitespace

## Display Rules

**In Article Listings** (Sidebar):
- Shows: Title, Date, Excerpt
- Sorted: By date (newest first)
- Filtered: By search term or tags (future feature)

**In Article View** (Main Frame):
- Shows: Title, Publication date, Read time estimate, Tags, Content
- Tags are clickable (future feature)
- "Back to Articles" link at bottom

## Technical Details

### Article Loading
- Articles loaded dynamically at runtime using Vite's glob import
- Path: `import.meta.glob('../articles/*.md')`
- Content delivered as raw markdown strings
- No preprocessing on build (CSR model)

### Parsing
- Frontmatter parsed with custom browser-compatible YAML parser
- Markdown rendered with `marked.js`
- No sanitization (markdown from trusted source)

### Metadata
Articles stored as TypeScript `Article` interface:
```typescript
interface Article {
  slug: string              // filename without .md extension
  title: string            // from frontmatter title
  date: Date               // parsed from frontmatter date
  excerpt: string          // from frontmatter excerpt
  content: string          // raw markdown content
  html: string             // rendered HTML from marked.js
  tags?: string[]          // from frontmatter tags array
  author?: string          // from frontmatter author
}
```

## Quick Reference

### Minimum Article

```markdown
---
title: Article Title
date: 2026-03-04
excerpt: Brief description of what this article is about.
tags: [tag1, tag2]
---

Article content goes here.
```

### Required Fields
1. Filename: `YYYY-MM-DD-slug.md`
2. Frontmatter: `title`, `date`, `excerpt`
3. Content: At least some markdown text

### Optional Fields
- `tags` (array)
- `author` (string)
- Additional markdown sections, code blocks, etc.

## Editing Existing Articles

To modify an article:

1. Edit the `.md` file directly
2. Save changes
3. Commit to git with message: `content: update article - [title]`
4. Changes appear on next page load (dev) or after rebuild (production)

**Do NOT change**:
- Filename (would break article URLs)
- Date (would change article order)

**OK to change**:
- Title
- Excerpt
- Tags
- Content (markdown body)
- Author

## Adding New Articles

1. Create new file: `articles/YYYY-MM-DD-slug.md`
2. Add YAML frontmatter (copy from example above)
3. Write markdown content
4. Save and commit
5. Article appears automatically in sidebar

See `CONTRIBUTING.md` for detailed instructions.

---

**Status**: Established and used for all current articles  
**Related**: `CONTRIBUTING.md` (how to write articles), `docs/discovery/TAG_FILTERING_FEATURE.md` (future tag filtering)
