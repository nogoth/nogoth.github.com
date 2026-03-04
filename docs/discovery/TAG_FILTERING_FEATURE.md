# Tag Filtering Feature for Nogoth Blog

**Date**: 2026-03-04  
**Status**: Requested  
**Priority**: Future enhancement  
**Complexity**: Low-Medium

## Feature Request

Enable tag-based filtering in the blog so that clicking a tag on an article resets the sidebar to show only articles that contain that same tag.

## Current State

- ✅ Articles have tags in their YAML frontmatter (e.g., `tags: [jekyll, tools, generators]`)
- ✅ Tags are displayed on articles in the main view
- ❌ Tags are not clickable
- ❌ No filtering mechanism exists

## Desired Behavior

1. **Click a tag** on an article in the main view
2. **Sidebar updates** to show only articles containing that tag
3. **Search box clears** or stays (TBD)
4. **Visual indicator** shows which tag is active (e.g., "Showing articles tagged: jekyll")
5. **Clear button or click tag again** to reset back to all articles

## Example Flow

```
User reads "This is a Test" article
  ↓
Sees tags: [jekyll, tools, generators]
  ↓
Clicks "jekyll" tag
  ↓
Sidebar filters to show only articles tagged "jekyll"
  ↓
Sidebar displays:
  - This is a Test (has jekyll)
  - Yaml Syck (does NOT have jekyll - filtered out)
  - Future work (does NOT have jekyll - filtered out)
```

## Implementation Notes

### Components Affected
- **ArticleDetail.vue**: Make tags clickable, emit tag selection event
- **Home.vue**: 
  - Add `activeTag` state
  - Update `filteredArticles` computed property to filter by tag
  - Add visual indicator of active tag filter
  - Add clear/reset button

### Logic Changes
Currently `filteredArticles` filters by search term:
```typescript
const filteredArticles = computed(() => {
  return articles.value.filter(
    a =>
      a.title.toLowerCase().includes(search.value.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.value.toLowerCase())
  )
})
```

Should be updated to also filter by `activeTag`:
```typescript
const filteredArticles = computed(() => {
  return articles.value.filter(a => {
    // Filter by search
    const matchesSearch =
      a.title.toLowerCase().includes(search.value.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.value.toLowerCase())
    
    // Filter by tag
    const matchesTag = activeTag.value 
      ? a.tags?.includes(activeTag.value) 
      : true
    
    return matchesSearch && matchesTag
  })
})
```

### Questions to Resolve

1. **Search + Tag interaction**: Should search results also filter by active tag?
   - Option A: Yes, both filters apply (AND logic)
   - Option B: No, tag filter overrides search
   
2. **Visual indicator**: Where to show active tag?
   - Option A: Badge in sidebar header ("Filter: jekyll ✕")
   - Option B: Subtitle above article list
   - Option C: Highlight active tag in sidebar

3. **Reset behavior**: How to clear the filter?
   - Option A: Click tag again
   - Option B: Click "X" button next to filter badge
   - Option C: Click "All Articles" button

4. **URL integration**: Should tag filters update the URL?
   - Option A: Yes, `/blog?tag=jekyll` for bookmarking
   - Option B: No, keep sidebar state only

## Potential Enhancements

- Tag cloud: Show all available tags with article counts
- Tag suggestions: "Related articles tagged [xyz]"
- Multiple tag selection: Filter to articles with ALL selected tags
- Tag search: Search within tags

## Implementation Timeline

- **Estimated effort**: 1-2 hours
- **Testing**: 30 minutes
- **Documentation**: 15 minutes

## Checklist

- [ ] Decide on search + tag interaction logic
- [ ] Decide on visual indicator placement
- [ ] Decide on reset/clear mechanism
- [ ] Implement `activeTag` state in Home.vue
- [ ] Update `filteredArticles` computed property
- [ ] Make tags clickable in ArticleDetail.vue
- [ ] Add tag selection handler in Home.vue
- [ ] Style active tag indicator
- [ ] Test with different tag combinations
- [ ] Update this request as implementation progresses

## Related Files

- `src/pages/Home.vue` - Main component with filtering logic
- `src/components/ArticleDetail.vue` - Article display with tags
- `src/utils.ts` - Article data structure and loading

---

**Requested by**: User  
**Status**: Awaiting implementation  
**Blockers**: None - ready to implement whenever
