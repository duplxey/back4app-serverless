import "@/styles/globals.css";
import Parse from "parse/dist/parse.min.js";

Parse.initialize(
  "fVj5O1INQBmuag278YJV6DnT8wbeJy4Z3z75hNO5",
  "SoXIyAN4DddHikyrJvo3rWPOr4wWM6sBMaI1q4eN",
);
Parse.serverURL = "https://parseapi.back4app.com/";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
