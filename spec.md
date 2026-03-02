# Specification

## Summary
**Goal:** Add positional commenting to project images in the Creative Tracker, allowing users to click anywhere on an image to drop comment pins at that exact location.

**Planned changes:**
- Extend the `CreativeProject` backend data model to include a `comments` array, where each comment stores an ID, text, x/y position as percentages, and a timestamp
- Add backend functions `addComment(projectId, text, x, y)` and `deleteComment(projectId, commentId)`
- Add `useAddComment` and `useDeleteComment` React Query mutation hooks that invalidate the affected project query on success
- Create a new `ImageWithComments` component that renders an image with overlaid positional comment pins; clicking the image opens an inline input to add a pin, each pin shows a truncated preview by default and expands to full text on hover, and includes a delete button on hover
- Replace the static image display in `ProjectDetailPage` with the `ImageWithComments` component, passing comments and mutation callbacks

**User-visible outcome:** On the project detail page, users can click anywhere on a project image to drop a comment pin at that location. Pins appear as subtle markers showing a short preview, expand to full text on hover, and can be deleted without any login required.
