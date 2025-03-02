import './globals.css'

export const metadata = {
  title: 'Inventory Management System',
  description: 'Barcode-Driven Inventory System with Kanban Board',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}