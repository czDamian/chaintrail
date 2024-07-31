import Image from "next/image";

const Loader = () => {
  const images = [
    { id: 1, src: "/loader/loader1.png", alt: "loader" },
    { id: 2, src: "/loader/loader2.png", alt: "loader" },
    { id: 3, src: "/loader/loader3.png", alt: "loader" },
    { id: 4, src: "/loader/loader4.png", alt: "loader" },
  ];

  return (
    <div className="flex flex-col justify-center items-center gap-0 z-50 pb-20 min-h-screen">
      <div className="flex">
        {images.slice(0, 2).map((image) => (
          <div key={image.id} className="">
            <Image
              src={image.src}
              alt={image.alt}
              width={100}
              height={100}
              className="w-40 h-40 animate-rotate"
            />
          </div>
        ))}
      </div>
      <div className="flex">
        {images.slice(2, 4).map((image) => (
          <div key={image.id} className="">
            <Image
              src={image.src}
              alt={image.alt}
              width={100}
              height={100}
              className="w-40 h-40 animate-rotate"
            />
          </div>
        ))}
      </div>
        <Image
          src="/loader/letterblock.png"
          alt="loading text"
          width={1000}
          height={1000}
          className="w-full max-w-[300px] pt-3"
        />
    </div>
  );
};

export default Loader;
