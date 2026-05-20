export function DatabaseError() {
  return (
    <div className="mb-5 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm font-extrabold text-red-200">
      Database connection failed. Check that your MongoDB Atlas username, password, database access permissions, and network access allow this app to connect, then restart the app.
    </div>
  );
}
