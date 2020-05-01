export default function authHeader(): { Authorization: string } | {} {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (Object.keys(user).length && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
}
