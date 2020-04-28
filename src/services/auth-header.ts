export default function authHeader(): { Authorization: string } | {} {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.length && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
}
