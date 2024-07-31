import { Krona_One } from "next/font/google";
import { Cinzel } from "next/font/google";
import { Lato } from "next/font/google";
import { Raleway } from "next/font/google";

export const kronaOne = Krona_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});
export const raleway = Raleway({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const cinzel = Cinzel({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});
