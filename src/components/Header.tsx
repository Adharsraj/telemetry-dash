const Header = ({ status }: { status: string }) => {
  return (
    <div className="bg-green-500 flex justify-between items-center text-white p-5">
      <p>Site id :553343</p>
      <p>Grid status:{status}</p>
    </div>
  );
};

export default Header;
