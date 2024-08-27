import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTelegram,
  FaLinkedin,
} from "react-icons/fa";

const MoreCoins = () => {
  const tasks = [
    {
      platform: "Follow us on Facebook",
      points: 300,
      icon: <FaFacebook size={24} />,
    },
    {
      platform: "Follow us on Twitter (X)",
      points: 250,
      icon: <FaTwitter size={24} />,
    },
    {
      platform: "Follow EduChain on Twitter (X)",
      points: 250,
      icon: <FaTwitter size={24} />,
    },
    {
      platform: "Follow us on Instagram",
      points: 200,
      icon: <FaInstagram size={24} />,
    },
    {
      platform: "Follow us on YouTube",
      points: 300,
      icon: <FaYoutube size={24} />,
    },
    {
      platform: "Join our Telegram channel",
      points: 250,
      icon: <FaTelegram size={24} />,
    },
    {
      platform: "Join EduChain Telegram channel",
      points: 250,
      icon: <FaTelegram size={24} />,
    },
    {
      platform: "Follow us on LinkedIn",
      points: 200,
      icon: <FaLinkedin size={24} />,
    },
  ];

  return (
    <section>
      <div className="">
        <h1 className="my-4 px-4 text-2xl">EARN MORE POINTS</h1>
        <div className="mt-10 space-y-2">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-800 px-4 py-2 text-sm md:text-lg rounded-xl mx-2">
              <div className="flex items-center">
                <div className="text-white mr-4">{task.icon}</div>
                <div className="flex flex-col gap-1">
                  <span className="text-white text-base font-semibold">
                    {task.platform}
                  </span>
                  <span className="text-gray-400">
                    <img
                      src="/coins.png"
                      alt="coins"
                      width={24}
                      height={24}
                      className="inline mr-1"
                    />
                    +{task.points}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="bg-white text-black py-2 px-4 rounded-xl text-sm font-bold">
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreCoins;
