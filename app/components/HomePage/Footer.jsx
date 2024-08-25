import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const teamMembers = [
    {
      name: "Okoye Kevin Chibuoyim",
      role: "Project Manager",
      image: "/team/photo_2024-07-24_20-18-21.jpg",
      github: "https://github.com/KevinChibuoyim",
    },
    {
      name: "Damian Olebuezie ",
      role: "Smart Contract Developer",
      image: "/team/photo_2024-07-25_02-29-08.jpg",
      github: "https://github.com/czDamian",
    },
    {
      name: "Okeke Chinedu Emmanuel",
      role: "Frontend Developer",
      image: "/team/photo_2024-07-24_20-23-00.jpg",
      github: "https://github.com/chiscookeke11",
    },
    {
      name: "Osatuyi Flora",
      role: "UI/UX Designer",
      image: "/team/Flora.jpg",
      github: "https://x.com/oluwa_chioma",
    },
    {
      name: "Princewill Emeka",
      role: "Backend Developer",
      image: "/team/photo_2024-07-25_02-29-03.jpg",
      github: "https://github.com/Prnzwil",
    },
    {
      name: "Agbasieje Peace Chioma",
      role: "UI/UX Designer",
      image: "/team/photo_2024-07-25_02-29-06.jpg",
      twitter: "https://x.com/oluwa_chioma/status/1786824275749486960?s=46",
    },
  ];

  return (
    <footer className=" w-full bg-slate-700 py-12">
      <div className=" px-4">
        <div className="">
          <div className="p-2 my-4">
            <h2 className="text-3xl text-center font-bold mb-6">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {teamMembers.map((member, index) => (
                <Link
                  key={index}
                  href={member.github || member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block">
                  <div className=" overflow-hidden flex items-center justify-start hover:bg-slate-800 rounded-lg px-2">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={50}
                      height={50}
                      className=" w-[50px] h-[50px] rounded-full object-cover"
                    />
                    <div className="p-4">
                      <h5 className="font-bold text-[#EEEEEE]">
                        {member.name}
                      </h5>
                      <p className="text-[#D4D0E0] text-sm pt-2">{member.role}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <span className="text-[#D4D0E0] text-xs">(c) 2024 CryptoTrail</span>
      </div>
    </footer>
  );
};

export default Footer;
