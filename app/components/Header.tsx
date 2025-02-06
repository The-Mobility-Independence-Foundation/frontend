export default function Header() {
  return <div className="bg-[#002856] py-[0.5rem] w-full flex justify-around items-center font-bold text-white text-xs">
    <img src="/assets/Header Logo.png" alt="logo" className="w-[20%]"></img>
    <div className="space-x-[1rem]">
      <a href="/listings">Public Listings</a>
      <a href="/forum">Forum</a>
      <a href="/messages">Private Messages</a>
      <a href="/inventories">My Inventories</a>
      <a href="/listings">My Listings</a>
    </div>
    <a href="/account">Account</a>
  </div>
}