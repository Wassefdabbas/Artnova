import { IKImage } from "imagekitio-react";

function Image({ path, src, alt, className, w, h, ...props}) {
  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_ImageKit_URL}
      path={path}
      src={src}
      transformation={[{ width: w, height: h }]}
      alt={alt}
      loading="lazy"
      className={className}
      lqip={{ active: true, quality: 20 }}
      {...props}
    />
  );
}

export default Image;
