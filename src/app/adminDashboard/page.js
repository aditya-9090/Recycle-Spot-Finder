import AdminDashboard from '../components/AdminDashboard'; // Add this import statement
 
export default async function AdminDashboardPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations`, {
    cache: "no-store"
  });
  const locations = await res.json();

  return <AdminDashboard locations={locations} />;
}
