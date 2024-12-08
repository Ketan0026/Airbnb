export default function Image({ src, ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : `https://airbnb-1tti.onrender.com/uploads/${src?.replace(
          "public\\uploads\\",
          ""
        )}`;
  return <img {...rest} src={src} alt={""} />;
}
