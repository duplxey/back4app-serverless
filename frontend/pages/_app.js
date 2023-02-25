import "@/styles/globals.css";
import Parse from "parse/dist/parse.min.js";

Parse.initialize(
  "<your_app_id>",
  "<your_javascript_key>",
);

Parse.serverURL = "https://parseapi.back4app.com/";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
