import { Button2 } from "../Reusable/Button";
const Partners = () => {
  return (
    <div className="my-16 w-fit mx-auto text-center hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] dark:shadow-gray-700/25">
      <div className="rounded-[10px] p-12 bg-gray-900">
        <h1 className="text-4xl font-extrabold my-2">PARTNERS</h1>
        <p className="my-3 font-lato">Know Our Partners & Sponsors</p>
        <Button2 className="my-4 px-4 py-2">
          coming soon
        </Button2>
      </div>
    </div>
  );
};
export default Partners;
