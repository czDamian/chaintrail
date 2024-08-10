import Button from "../Reusable/Button";
const Partners = () => {
  return (
    <div className="my-20 w-fit mx-auto text-center hover:animate-background rounded-xl bg-gradient-to-r from-yellow-400 via-gold-500 to-yellow-400 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] dark:shadow-gray-700/25">
      <div className="rounded-[10px] p-16 bg-gray-900">
        <h1 className="text-4xl font-extrabold my-2">PARTNERS</h1>
        <p className="my-3 font-lato">Know Our Partners & Sponsors</p>
        <Button className="my-4 py-2 font-bold text-black text-xs">
          coming soon
        </Button>
      </div>
    </div>
  );
};
export default Partners;
