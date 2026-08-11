import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getAllUsers, updateUserRole } from "../../../services/firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { Loader, EmptyState } from "../../../components/common";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { Heading, Text } from "../../../components/ui/Typography";

function AdminCustomers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const toggleRole = async (targetUser) => {
    const nextRole = targetUser.role === "admin" ? "customer" : "admin";
    setUpdatingId(targetUser.id);
    try {
      await updateUserRole(targetUser.id, nextRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: nextRole } : u))
      );
      toast.success(`${targetUser.name || targetUser.email} is now ${nextRole}`);
    } catch {
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader fullScreen label="Loading customers..." />;

  return (
    <div>
      <Heading level="h2" className="mb-1">
        Customers
      </Heading>
      <Text tone="muted" className="mb-8">
        {users.length} registered user{users.length !== 1 && "s"}
      </Text>

      {users.length === 0 ? (
        <EmptyState title="No customers yet" description="Registered users will show up here." />
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="flex flex-col gap-3 md:hidden">
            {users.map((u) => (
              <div
                key={u.id}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {u.name || "—"}
                    </p>
                    <p className="truncate text-xs text-[var(--text-light)]">{u.email}</p>
                  </div>
                  <Badge variant={u.role === "admin" ? "primary" : "neutral"}>{u.role}</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  disabled={u.id === currentUser?.uid}
                  loading={updatingId === u.id}
                  onClick={() => toggleRole(u)}
                >
                  {u.role === "admin" ? "Revoke Admin" : "Make Admin"}
                </Button>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] md:block">
            <table className="w-full text-left text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs uppercase text-[var(--text-light)]">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-5 py-3 font-medium text-[var(--text)]">{u.name || "—"}</td>
                    <td className="px-5 py-3 text-[var(--text-light)]">{u.email}</td>
                    <td className="px-5 py-3">
                      <Badge variant={u.role === "admin" ? "primary" : "neutral"}>{u.role}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={u.id === currentUser?.uid}
                        loading={updatingId === u.id}
                        onClick={() => toggleRole(u)}
                      >
                        {u.role === "admin" ? "Revoke Admin" : "Make Admin"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminCustomers;
