import UserList from "./UserList";
export const metadata = {
  title: "All Users",
  description: "Earn NFTs while playing your favorite game",
};
const Users = () => {
  return (
    <div className="mt-20">
      <UserList />
    </div>
  );
};
export default Users;
