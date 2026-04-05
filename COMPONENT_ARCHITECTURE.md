# Component Architecture Diagram

Use this text representation for your documentation or recreate visually using draw.io or PowerPoint.

## Application Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                 │
│                     (Root Component with Providers)                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              UserProfileContext Provider                    │    │
│  │  - Manages: profile state, updateProfile(), isComplete()   │    │
│  │  - Storage: localStorage                                    │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │               PortfolioContext Provider                     │    │
│  │  - Manages: portfolio items, calculations                   │    │
│  │  - Methods: add, remove, update                             │    │
│  │  - Storage: localStorage                                    │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    RouterProvider                           │    │
│  │                  (React Router v7)                          │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         RootLayout.jsx                               │
│                    (Persistent Layout Wrapper)                       │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   Navbar Component                          │    │
│  │  - Links: Home, Products, Profile, Recommendations, Portfolio │
│  │  - Portfolio Badge: Shows item count (from PortfolioContext) │
│  │  - Persistent: Visible on all pages                         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    Outlet (Page Content)                    │    │
│  │              React Router swaps pages here                  │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Page Components & Their Children

### 1. Home Page
```
Home.jsx
├── Hero Section
├── Stats Section
├── Categories Grid
│   └── 4 × Category Card (links to ProductListing)
└── Featured Products Section
    └── ProductCard[] (1-4 cards)
        ├── Props: product
        ├── Image
        ├── Product Info
        ├── RiskBadge
        └── Add to Portfolio Button
```

### 2. Product Listing Page
```
ProductListing.jsx
│
├── Search & Sort Bar
│   ├── Search Input (with debouncing)
│   └── Sort Dropdown
│
├── FilterPanel Component
│   ├── Props: filters, onFilterChange, productCount
│   ├── Risk Level Checkboxes
│   ├── Return Range Inputs
│   ├── Category Checkboxes
│   ├── Liquidity Dropdown
│   ├── Time Horizon Dropdown
│   └── Min Investment Input
│
└── Products Grid
    └── ProductCard[] (multiple cards)
        ├── Props: product
        ├── usePortfolio() hook
        └── Handles "Add to Portfolio"
```

### 3. Product Detail Page
```
ProductDetail.jsx
├── Breadcrumb Navigation
├── Product Image Section
├── Product Info Section
│   ├── Title
│   ├── Category Badge
│   ├── RiskBadge Component
│   ├── Key Metrics Cards
│   └── Add to Portfolio Button
├── Risk Visualization Bar
├── Decision Insight Card
│   └── generateDecisionInsight()
├── Description Section
├── Return Calculator
│   ├── Investment Input
│   └── Projection Table (5 years)
└── Financial Attributes Explanations
```

### 4. User Profile Page
```
UserProfile.jsx
├── Profile Header
├── Profile Form
│   ├── Risk Tolerance (Radio Buttons)
│   ├── Investment Horizon (Radio Buttons)
│   ├── Monthly Capacity (Number Input)
│   ├── Liquidity Preference (Dropdown)
│   ├── Investment Goal (Dropdown)
│   ├── Validation Logic
│   └── Submit Button
├── Recommendation Preview (conditional)
│   └── Shows matching count if valid
└── Current Profile Summary (if exists)
```

### 5. Recommendations Page
```
Recommendations.jsx
│
├── Conditional Rendering:
│   ├── If NO profile: "Create Profile First" message
│   └── If HAS profile: Show recommendations
│
├── Profile Summary Card
│   ├── Uses: useUserProfile() hook
│   ├── Displays: All profile attributes
│   └── Edit Profile Link
│
├── Recommendations Info Section
│   └── Why These Products? (4 reasons)
│
└── Recommendations Grid
    └── ProductCard[] (filtered products)
        └── getRecommendations() algorithm applied
```

### 6. Portfolio Page
```
Portfolio.jsx
│
├── Conditional Rendering:
│   ├── If EMPTY: "Empty Portfolio" message
│   └── If HAS items: Show portfolio management
│
├── High Risk Warning (conditional)
│   └── If >70% high risk allocation
│
├── Portfolio Summary
│   ├── Total Invested
│   ├── Weighted Expected Return
│   └── Product Count
│
├── Risk Distribution Visualization
│   ├── Horizontal Bar Chart
│   └── Risk Legend (Low, Medium, High %)
│
├── Category Distribution
│   └── Multiple Progress Bars
│
└── Portfolio Items List
    └── Portfolio Item[] (for each product)
        ├── Product Image
        ├── Product Info Link
        ├── Amount Display/Edit
        │   ├── Edit Mode (input + save/cancel)
        │   └── View Mode (amount + edit button)
        └── Remove Button
```

### 7. Not Found Page
```
NotFound.jsx
├── 404 Error Code Display
├── Error Message
└── Action Buttons
    ├── Go Home Link
    └── Browse Products Link
```

## Reusable Component Details

### ProductCard Component
**Used in:** Home, ProductListing, Recommendations  
**Props:** `product`  
**Hooks Used:** `usePortfolio()`  
**Responsibilities:**
- Display product summary
- Show product image
- Display expected return prominently
- Show RiskBadge
- Show liquidity, min investment
- Hover overlay with additional details
- Handle "Add to Portfolio" action
- Show "In Portfolio" state if already added

### FilterPanel Component
**Used in:** ProductListing  
**Props:** `filters`, `onFilterChange`, `productCount`  
**Responsibilities:**
- Display all 6 filter types
- Handle filter state changes
- Communicate changes to parent (callback)
- Show active filter count
- Provide "Reset All" button
- Show matching product count
- Collapsible interface

### RiskBadge Component
**Used in:** ProductCard, ProductDetail  
**Props:** `riskLevel`, `size`  
**Responsibilities:**
- Display risk level with color coding
- Green for low, Yellow for medium, Red for high
- Support different sizes (small, medium, large)
- Hover animation

### Navbar Component
**Used in:** RootLayout (visible everywhere)  
**Props:** None (uses Context)  
**Hooks Used:** `usePortfolio()`  
**Responsibilities:**
- Display navigation links
- Show active page
- Display portfolio item count badge
- Animate badge on changes
- Responsive mobile menu (if implemented)

## Data Flow Diagrams

### Adding Product to Portfolio
```
User clicks "Add to Portfolio"
         ↓
ProductCard.handleAddToPortfolio()
         ↓
Calls: addToPortfolio(product, amount)
         ↓
PortfolioContext.addToPortfolio()
         ↓
1. Check if product exists
2. Update items array
3. Recalculate all statistics
4. Save to localStorage
         ↓
Context state updates
         ↓
All components using usePortfolio() re-render:
- Navbar (badge count updates)
- ProductCard (button state changes)
- Portfolio page (shows new item)
```

### Getting Recommendations
```
User creates/updates profile
         ↓
UserProfile.handleSubmit()
         ↓
Calls: updateProfile(formData)
         ↓
UserProfileContext.updateProfile()
         ↓
1. Update profile state
2. Save to localStorage
         ↓
Navigate to Recommendations page
         ↓
Recommendations.jsx loads
         ↓
Calls: getRecommendations(products, profile)
         ↓
Filter Logic:
1. Filter by risk tolerance
2. Filter by investment horizon
3. Filter by liquidity preference
4. Filter by budget
5. Sort based on risk tolerance
         ↓
Display filtered products
```

### Applying Filters
```
User changes filter in FilterPanel
         ↓
FilterPanel calls: onFilterChange(newFilters)
         ↓
ProductListing.setFilters(newFilters)
         ↓
State updates in ProductListing
         ↓
useEffect triggers (depends on filters)
         ↓
applyFiltersAndSearch() function runs
         ↓
Filter Logic (AND combination):
1. Apply search query (OR)
2. Apply risk filter (OR within)
3. Apply return range (AND)
4. Apply category filter (OR within)
5. Apply liquidity filter (AND)
6. Apply time horizon filter (AND)
7. Apply budget filter (AND)
8. Apply sorting
         ↓
setFilteredProducts(result)
         ↓
Products grid re-renders
```

## Context Structure

### UserProfileContext
```javascript
Context Value:
{
  profile: {
    riskTolerance: string,
    investmentHorizon: string,
    monthlyCapacity: number,
    liquidityPreference: string,
    investmentGoal: string
  },
  updateProfile: (newProfile) => void,
  clearProfile: () => void,
  isProfileComplete: () => boolean,
  isLoading: boolean
}

Consumers:
- UserProfile page (read & write)
- Recommendations page (read only)
- Navbar (read only for display)
```

### PortfolioContext
```javascript
Context Value:
{
  portfolio: {
    items: [{product, amount}],
    totalInvested: number,
    weightedReturn: number,
    riskDistribution: {low, medium, high},
    categoryDistribution: {category: percentage}
  },
  addToPortfolio: (product, amount) => void,
  removeFromPortfolio: (productId) => void,
  updateAllocation: (productId, newAmount) => void,
  isInPortfolio: (productId) => boolean,
  clearPortfolio: () => void
}

Consumers:
- Navbar (read items.length)
- ProductCard (add, isInPortfolio check)
- Portfolio page (read all, remove, update)
- ProductDetail (add, isInPortfolio check)
```

## Utility Function Structure

### api.js
```
Functions:
- fetchFinancialProducts()
  → Fetches from Fake Store API
  → Transforms each product
  → Returns array of financial products

- transformToFinancialProduct(apiProduct)
  → Maps category
  → Assigns risk
  → Calculates return
  → Assigns liquidity
  → Assigns time horizon
  → Returns financial product object

- getCachedProducts()
  → Checks localStorage cache
  → Returns cached if <1 hour old
  → Otherwise fetches fresh
  → Saves to cache
```

### financial.js
```
Functions:
- calculateWeightedReturn(items)
  → Sums (weight × return)
  → Returns percentage

- calculateRiskDistribution(items)
  → Groups by risk level
  → Calculates percentages
  → Returns {low, medium, high}

- calculateCategoryDistribution(items)
  → Groups by category
  → Calculates percentages
  → Returns object

- generateDecisionInsight(product)
  → Analyzes product attributes
  → Builds insight sentences
  → Returns string

- getRecommendations(products, profile)
  → Filters by risk tolerance
  → Filters by investment horizon
  → Filters by liquidity
  → Filters by budget
  → Sorts appropriately
  → Returns array

- calculateProjectedReturns(principal, rate, years)
  → Compound interest calculation
  → Returns array of projections

- formatCurrency(amount)
  → Formats to PKR currency
  → Returns string

- getFeaturedProducts(products)
  → Finds highest return per category
  → Returns array of 4 products
```

## State Management Summary

### Global State (Context)
1. **UserProfileContext**
   - Why: Multiple pages need profile (Recommendations, Profile, Navbar)
   - Storage: localStorage
   - Consumers: 3+ components

2. **PortfolioContext**
   - Why: Portfolio data needed across app (Navbar, Cards, Portfolio page)
   - Storage: localStorage
   - Consumers: 4+ components

### Local State (useState)
1. **Filter state** (ProductListing)
   - Why: Only affects this page
   - Consumers: FilterPanel child only

2. **Form state** (UserProfile)
   - Why: Only affects this form
   - Consumers: Form inputs only

3. **Search query** (ProductListing)
   - Why: Local to this page
   - Consumers: Search input only

4. **Edit mode** (Portfolio)
   - Why: Individual item editing
   - Consumers: Single item only

5. **Loading states** (All pages)
   - Why: Page-specific loading
   - Consumers: Current page only

## Routing Configuration

```javascript
Routes:
/                    → Home.jsx
/products            → ProductListing.jsx
/products?category=X → ProductListing.jsx (with filter)
/product/:id         → ProductDetail.jsx (dynamic)
/profile             → UserProfile.jsx
/portfolio           → Portfolio.jsx
/recommendations     → Recommendations.jsx
*                    → NotFound.jsx (catch-all)

All routes wrapped in:
- UserProfileContext
- PortfolioContext
- RootLayout (with Navbar)
```

---
