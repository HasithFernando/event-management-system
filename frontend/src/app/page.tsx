export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Event Management System</h1>
        <p className="text-lg mb-8">
          Welcome to the Event Management System - A microservices-based platform
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Events</h2>
            <p className="text-gray-600">Browse and manage events</p>
            {/* TODO: Add link to events page */}
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-gray-600">User management and profiles</p>
            {/* TODO: Add link to users page */}
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Bookings</h2>
            <p className="text-gray-600">Manage event bookings</p>
            {/* TODO: Add link to bookings page */}
          </div>
        </div>
      </div>
    </main>
  )
}
