import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const teamMembers = [
    {
      name: "Okoye Kevin C.",
      role: "Project Manager",
      image: "/team/photo_2024-07-24_20-18-21.jpg",
      github: "https://github.com/KevinChibuoyim",
      twitter: " ",
      linkedin: " ",
    },
    {
      name: "Damian Olebuezie",
      role: "Smart Contract Developer",
      image: "/team/photo_2024-07-25_02-29-08.jpg",
      github: "https://github.com/czDamian",
      twitter: " ",
      linkedin: " ",
    },
    {
      name: "Okeke Chinedu E.",
      role: "Frontend Dev",
      image: "/team/photo_2024-07-24_20-23-00.jpg",
      github: "https://github.com/chiscookeke11",
      twitter: " ",
      linkedin: " ",
    },
    {
      name: "Osatuyi Flora",
      role: "UI/UX Designer",
      image: "/team/Flora.jpg",
      github: "https://x.com/oluwa_chioma",
      twitter: " ",
      linkedin: " ",
    },
    {
      name: "Princewill Emeka",
      role: "Backend Dev",
      image: "/team/photo_2024-07-25_02-29-03.jpg",
      github: "https://github.com/Prnzwil",
      twitter: " ",
      linkedin: " ",
    },
    {
      name: "Agbasieje Peace C.",
      role: "UI/UX Designer",
      image: "/team/photo_2024-07-25_02-29-06.jpg",
      github: "https://x.com/oluwa_chioma/status/1786824275749486960?s=46",
      twitter: " ",
      linkedin: " ",
    },
  ];

  return (
    <footer className="w-full bg-slate-700 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl text-center font-bold my-12 text-[#EEEEEE]">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-slate-800 p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex items-center">
              <Image
                src={member.image}
                alt={member.name}
                width={80}
                height={80}
                className="w-16 h-16 border-2 border-gray-900 rounded-full object-cover mr-4"
              />
              <div className="flex-grow">
                <h5 className="font-bold text-[#EEEEEE] text-sm">
                  {member.name}
                </h5>
                <p className="text-[#D4D0E0] text-xs mb-1">{member.role}</p>
                <div className="flex gap-2">
                  {member.github && (
                    <Link href={member.github} target="_blank">
                      <FaGithub className="text-[#EEEEEE] hover:text-gray-400 text-lg" />
                    </Link>
                  )}
                  {member.twitter && (
                    <Link href={member.twitter} target="_blank">
                      <FaTwitter className="text-[#EEEEEE] hover:text-gray-400 text-lg" />
                    </Link>
                  )}
                  {member.linkedin && (
                    <Link href={member.linkedin} target="_blank">
                      <FaLinkedin className="text-[#EEEEEE] hover:text-gray-400 text-lg" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <span className="text-[#D4D0E0] text-xs">&copy; 2024 CryptoTrail</span>
      </div>
    </footer>
  );
};

export default Footer;
