export default function Image({ src, ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : `https://airbnb-bdfq.onrender.com/uploads/${src?.replace(
          "public\\uploads\\",
          ""
        )}`;
  return <img {...rest} src={src} alt={""} />;
}
