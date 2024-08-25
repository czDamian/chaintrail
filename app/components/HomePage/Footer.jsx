import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const teamMembers = [
    {
      name: "Okoye Kevin Chibuoyim",
      role: "Project Manager",
      image: "/team/photo_2024-07-24_20-18-21.jpg",
      github: "https://github.com/KevinChibuoyim",
      twitter: "https://x.com/dummy",
      linkedin: "https://linkedin.com/dummy",
    },
    {
      name: "Damian Olebuezie",
      role: "Smart Contract Developer",
      image: "/team/photo_2024-07-25_02-29-08.jpg",
      github: "https://github.com/czDamian",
      twitter: "https://x.com/dummy",
      linkedin: "https://linkedin.com/dummy",
    },
    {
      name: "Okeke Chinedu Emmanuel",
      role: "Frontend Developer",
      image: "/team/photo_2024-07-24_20-23-00.jpg",
      github: "https://github.com/chiscookeke11",
      twitter: "https://x.com/dummy",
      linkedin: "https://linkedin.com/dummy",
    },
    {
      name: "Osatuyi Flora",
      role: "UI/UX Designer",
      image: "/team/Flora.jpg",
      github: "https://x.com/oluwa_chioma",
      twitter: "https://x.com/dummy",
      linkedin: "https://linkedin.com/dummy",
    },
    {
      name: "Princewill Emeka",
      role: "Backend Developer",
      image: "/team/photo_2024-07-25_02-29-03.jpg",
      github: "https://github.com/Prnzwil",
      twitter: "https://x.com/dummy",
      linkedin: "https://linkedin.com/dummy",
    },
    {
      name: "Agbasieje Peace Chioma",
      role: "UI/UX Designer",
      image: "/team/photo_2024-07-25_02-29-06.jpg",
      github: "https://x.com/oluwa_chioma/status/1786824275749486960?s=46",
      twitter: "https://x.com/dummy",
      linkedin: "https://linkedin.com/dummy",
    },
  ];

  return (
    <footer className="w-full bg-slate-700 py-12">
      <div className="px-4">
        <div className="p-2 my-4">
          <h2 className="text-3xl text-center font-bold mb-6 text-[#EEEEEE]">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-slate-800 p-4 rounded-lg text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out max-w-64 w-full mx-auto">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={1000}
                  height={1000}
                  className="mx-auto w-32 h-32 border-4 border-gray-900 rounded-full object-cover"
                />
                <h5 className="font-bold uppercase text-[#EEEEEE] mt-4">{member.name}</h5>
                <p className="text-[#D4D0E0] text-sm">{member.role}</p>
                <div className="flex justify-center gap-4 mt-4">
                  {member.github && (
                    <Link href={member.github} target="_blank">
                      <FaGithub className="text-[#EEEEEE] hover:text-gray-400 text-2xl" />
                    </Link>
                  )}
                  {member.twitter && (
                    <Link href={member.twitter} target="_blank">
                      <FaTwitter className="text-[#EEEEEE] hover:text-gray-400 text-2xl" />
                    </Link>
                  )}
                  {member.linkedin && (
                    <Link href={member.linkedin} target="_blank">
                      <FaLinkedin className="text-[#EEEEEE] hover:text-gray-400 text-2xl" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
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
