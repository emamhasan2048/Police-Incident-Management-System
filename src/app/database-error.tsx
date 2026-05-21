export function DatabaseError() {
  return (
    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-extrabold text-red-700">
      Database connection failed. Check that your MongoDB Atlas username, password, database access permissions, and network access allow this app to connect, then restart the app.
    </div>
  );
}
