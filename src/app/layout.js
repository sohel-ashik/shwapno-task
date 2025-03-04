import Sidebar from './components/utils/Sidebar'
import './globals.css'

export const metadata = {
  title: 'Inventory Management System',
  description: 'Barcode-Driven Inventory System with Kanban Board',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen w-full">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 transition-all duration-300 lg:ml-64 pt-16 lg:pt-4 px-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}