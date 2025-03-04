

# Inventory Management System

![Inventory Management System](https://i.imgur.com/placeholder.png)

A modern inventory management application built with Next.js, featuring barcode scanning, a Kanban board for product organization, and analytics dashboard.

**Live Demo:** [https://shwapno-task.vercel.app/](https://shwapno-task.vercel.app/)

## Features

### 📊 Analytics Dashboard
- Visual representation of inventory statistics
- Category distribution charts
- Recently added products tracking
- Real-time inventory overview

### 📱 Barcode Scanning
- Mobile-friendly barcode scanner
- Support for multiple barcode formats
- Manual entry option for damaged barcodes
- Flashlight toggle for low-light environments

### 📋 Kanban Board
- Drag-and-drop interface for product organization
- Dynamic category creation
- Responsive design for both desktop and mobile
- Visual status tracking for inventory items

### 🔍 Search Functionality
- Real-time product filtering
- Search by product name, barcode, or material ID
- Category-based filtering
- Mobile-optimized search results

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Drag and Drop**: react-dnd
- **Barcode Scanning**: react-qr-barcode-scanner

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/inventory-management.git
cd inventory-management
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── barcodeSection/     # Barcode scanning components
│   │   ├── kanban/             # Kanban board components
│   │   └── utils/              # Utility components (Sidebar, etc.)
│   ├── dashboard/              # Dashboard page
│   ├── api/                    # API routes
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout
│   └── page.js                 # Home page (Inventory)
├── ...
```

## Usage

### Barcode Scanning
1. Navigate to the inventory page
2. Click "Open Scanner"
3. Scan a product barcode or enter it manually
4. Review the product details and add to inventory

### Kanban Board
1. Products start in the "Uncategorized" category
2. Drag products between categories
3. Create new categories using the "Add Category" button
4. Organize your inventory based on your workflow

### Analytics Dashboard
1. Navigate to the Dashboard page
2. View category distribution and product statistics
3. Monitor recently added products
4. Use the search functionality to filter products

## Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile phones

The Kanban board automatically adjusts to a mobile-friendly view on smaller screens, while maintaining full functionality.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Built as part of the Shwapno Task project
- Icons provided by Lucide React
- Barcode scanning powered by react-qr-barcode-scanner

---

© 2025 Sohel Ashik
