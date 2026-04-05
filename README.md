# FinanceHub - Dynamic Financial Product Discovery Platform

A comprehensive React-based web application for discovering, comparing, and managing financial products with personalized recommendations based on user profiles.

## 🌟 Features

### Core Functionality
- **Multi-page React Application** with React Router
- **User Financial Profile System** with risk tolerance, investment horizon, and liquidity preferences
- **Smart Recommendation Engine** that dynamically matches products to user profiles
- **Portfolio Management** with real-time calculations (weighted returns, risk distribution)
- **Advanced Filtering** with multiple criteria (risk, return, category, liquidity, time horizon, budget)
- **Product Search** with debouncing
- **Sorting Options** (return, risk, investment amount)
- **Persistent Storage** using localStorage for profile and portfolio

### Pages
1. **Home** - Platform overview, featured products, category navigation
2. **Product Listing** - All products with comprehensive filters and search
3. **Product Detail** - Dynamic route with return calculator and decision insights
4. **User Profile** - Financial profile form with validation and live recommendations preview
5. **Recommendations** - Personalized product suggestions based on profile
6. **Portfolio** - Investment tracking with statistics and risk visualization
7. **404 Page** - Not found error page

### Financial Logic
- **Risk-to-Return Mapping**: Consistent data model (low risk = 3-7%, medium = 7-12%, high = 12-27%)
- **Profile-Based Filtering**: Conservative → low risk only, Moderate → low+medium, Aggressive → all risks
- **Portfolio Calculations**: Weighted expected return, risk distribution, category breakdown
- **Decision Insights**: Dynamically generated recommendations based on product attributes

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── FilterPanel.jsx       # Product filtering component
│   │   ├── FilterPanel.css
│   │   ├── Navbar.jsx             # Navigation with portfolio count
│   │   ├── Navbar.css
│   │   ├── ProductCard.jsx        # Product display card
│   │   ├── ProductCard.css
│   │   ├── RiskBadge.jsx          # Color-coded risk indicator
│   │   └── RiskBadge.css
│   ├── contexts/
│   │   ├── PortfolioContext.jsx   # Global portfolio state
│   │   └── UserProfileContext.jsx # Global user profile state
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── Home.css
│   │   ├── ProductListing.jsx     # All products with filters
│   │   ├── ProductListing.css
│   │   ├── ProductDetail.jsx      # Individual product details
│   │   ├── ProductDetail.css
│   │   ├── UserProfile.jsx        # Profile form
│   │   ├── UserProfile.css
│   │   ├── Recommendations.jsx    # Personalized recommendations
│   │   ├── Recommendations.css
│   │   ├── Portfolio.jsx          # Portfolio management
│   │   ├── Portfolio.css
│   │   ├── NotFound.jsx           # 404 page
│   │   └── NotFound.css
│   ├── utils/
│   │   ├── api.js                 # API integration and data transformation
│   │   └── financial.js           # Financial calculations and logic
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # Global app styles
│   ├── RootLayout.jsx             # Layout with persistent navbar
│   └── routes.js                  # React Router configuration
└── styles/
    ├── index.css
    ├── theme.css
    └── fonts.css
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd financehub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or if using pnpm:
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📊 Financial Logic Explanation

### Data Transformation
Products are fetched from Fake Store API and systematically transformed:
- **Category Mapping**: electronics → investment, jewelery → savings, men's clothing → insurance, women's clothing → crypto
- **Risk Assignment**: Based on category (deterministic, not random)
- **Return Calculation**: Deterministic based on product ID and risk level
  - Low risk: 3-7% annual return
  - Medium risk: 7-12% annual return
  - High risk: 12-27% annual return
- **Liquidity & Time Horizon**: Mapped based on category and risk

### Recommendation Algorithm
```javascript
// Step 1: Filter by risk tolerance
conservative → only low risk products
moderate → low + medium risk products
aggressive → all risk levels

// Step 2: Filter by investment horizon
short → short-term products
medium → short + medium-term products
long → all time horizons

// Step 3: Filter by liquidity preference
easy → only easy liquidity
moderate → easy + moderate liquidity
locked → all liquidity levels

// Step 4: Filter by budget
Only show products where minInvestment ≤ monthlyCapacity

// Step 5: Sort
conservative users → sort by lowest risk first
aggressive users → sort by highest return first
```

### Portfolio Calculations
- **Total Invested**: Sum of all allocated amounts
- **Weighted Return**: `Σ((allocation / total) × expectedReturn)`
- **Risk Distribution**: Percentage allocation by risk level
- **Category Distribution**: Percentage allocation by category

## 🎨 Design & Styling

- **No UI libraries used** - All CSS written from scratch
- **Professional color scheme**: Blue (#1a56db) for primary actions
- **Risk color coding**: Green (low), Yellow (medium), Red (high)
- **Responsive design**: Mobile, tablet, and desktop layouts
- **CSS animations**: Hover effects, transitions, loading states (200-500ms duration)

## 🔄 State Management

### Context API
1. **UserProfileContext**: Manages user financial profile
   - Risk tolerance, investment horizon, monthly capacity, liquidity preference, investment goal
   - Persisted in localStorage
   - Used by Recommendations page

2. **PortfolioContext**: Manages investment portfolio
   - Add/remove products, update allocations
   - Calculates portfolio statistics
   - Persisted in localStorage

### Local State (useState)
- Form inputs (controlled components)
- Filter states
- UI states (loading, editing, errors)
- Search queries


## 🎓 Learning Outcomes Achieved

✅ **React Architecture**: Multi-page app with component hierarchy  
✅ **Domain Logic**: Financial reasoning translated to code  
✅ **State Management**: Context API + useState effectively used  
✅ **API Integration**: External data transformation  
✅ **Dynamic Routing**: React Router with dynamic routes  
✅ **Form Handling**: Controlled forms with validation  
✅ **Conditional Rendering**: UI based on state and profile  
✅ **Filter Logic**: Multi-criteria filtering system  

## 🤝 Acknowledgments

This project was developed under the supervision of Professor Arsalan Khan as part of the Web Programming Course at FAST NUCES Islamabad.

This is an academic project. Contributions are not accepted.

## 📝 License

This project is for educational purposes only.

## 👨‍💻 Author

**Sumyyah Saeed**  
Student ID: 23i-5567  
Course: Web Programming  
Semester: 6th

---

**Note**: This application uses Fake Store API for demonstration purposes. All financial data is simulated and should not be used for real investment decisions.
