const Testing = () => (
  <div className="py-2 flex justify-between items-center text-sm mt-20 gap-6">
    <div className="text-xs gap-1 flex items-center">
      <img src="../chaincoins.svg" alt="Chain Coins" className="w-6 h-6" />
      <span>40</span>
    </div>
    <div className="flex items-center relative">
      <img src="../redImg.png" alt="level" className="w-12 h-12" />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">34</span>
    </div>
    <div className="text-xs gap-1 flex items-center">
      <img src="../ticket.png" alt="Chain Coins" className="w-6 h-6" />
      <span>30</span>
    </div>
  </div>
);

export default Testing;
