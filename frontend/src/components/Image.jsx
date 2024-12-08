export default function Image({ src, ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : `${import.meta.env.VITE_BACKEND_URL}/uploads/${src?.replace(
          "public\\uploads\\",
          ""
        )}`;
  return <img {...rest} src={src} alt={""} />;
}
