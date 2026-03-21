# Design System

## Philosophy

Zenovra's design system draws inspiration from Linear, Stripe, and Vercel — prioritizing clarity, density, and premium feel. The system is built on shadcn/ui + Radix primitives with Tailwind CSS.

## Colors

### Semantic Colors
- **Primary**: Indigo (`#6366f1`) — brand accent, CTAs, active states
- **Success**: Green — hired, accepted, approved states
- **Warning**: Amber — pending, on-hold states
- **Destructive**: Red — rejected, errors, destructive actions
- **Info**: Sky blue — informational badges, new items

### Neutrals
- Carefully tuned gray scale with blue undertones
- High contrast ratios for accessibility
- Distinct surface layers for depth

## Typography

- **Font**: Inter (with cv02, cv03, cv04, cv11 font features)
- **Scale**: Tailwind default + custom `2xs` (0.65rem)
- **Hierarchy**: Weight + size for clear information architecture

## Spacing

- Based on Tailwind's 4px grid
- Consistent padding: cards (p-5), sections (p-6 lg:p-8)
- Content max-width: 1400px for optimal readability

## Components

Built on shadcn/ui with custom extensions:
- **StatCard** — KPI display with trend indicators
- **StatusBadge** — Semantic status across all entity types
- **PageHeader** — Consistent page title + actions
- **EmptyState** — Illustrated empty states with CTAs
- **CommandPalette** — ⌘K quick navigation

## Motion

Uses Framer Motion for:
- Page-level entrance animations
- Card hover lift effects
- Staggered list item reveals
- Sidebar collapse/expand
- Modal/drawer transitions

Motion is subtle and professional — fast durations (200-300ms), ease-out curves, no bouncing.

## Dark Mode

Full dark mode support via CSS variables. Toggle in topbar. All components automatically adapt through the HSL variable system.
