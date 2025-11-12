import NextImage, { ImageProps } from "next/image";

const basePath = process.env.BASE_PATH;

interface CustomImageProps extends ImageProps {
  caption?: string;
}

const Image = ({ src, alt = "", caption, ...rest }: CustomImageProps) => {
  const isGif = typeof src === "string" && src.endsWith(".gif");

  return (
    <div className="flex flex-col items-center my-4">
      {isGif ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath || ""}${src}`}
            alt={alt}
            className="rounded-lg shadow-md"
            {...rest}
          />
        </>
      ) : (
        <NextImage
          src={`${basePath || ""}${src}`}
          alt={alt}
          className="rounded-lg shadow-md"
          {...rest}
        />
      )}
      {caption && (
        <p className="mt-2 text-sm text-gray-500 text-center">{caption}</p>
      )}
    </div>
  );
};

export default Image;
