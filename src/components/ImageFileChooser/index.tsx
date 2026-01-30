import ImageIcon from "@material-design-icons/svg/filled/image.svg?react";
import classNames from "classnames";
import { FC, useCallback, useId, useRef, useState } from "react";

interface Props {
  className?: string;
  title?: string;
  onImageChoose: (data: {
    src: string;
    naturalWidth: number;
    naturalHeight: number;
  }) => void;
}

export const ImageFileChooser: FC<Props> = ({
  className,
  title,
  onImageChoose,
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageSrc(URL.createObjectURL(file));
  }, []);

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      onImageChoose({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
      setImageSrc(null);
      if (inputRef.current) {
        // eslint-disable-next-line functional/immutable-data
        inputRef.current.value = "";
      }
    },
    [onImageChoose],
  );

  const handleError = useCallback(() => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(null);
  }, [imageSrc]);

  return (
    <>
      <label
        htmlFor={inputId}
        className={classNames(
          className,
          "block rounded-full bg-slate-950/80 p-2 hover:bg-slate-950/50",
          "transition-bg duration-200 ease-in-out cursor-pointer",
        )}
        title={title}
      >
        <ImageIcon
          className='block size-5 object-contain'
          style={{ fill: "white" }}
          viewBox='0 0 24 24'
        />
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleChange}
      />
      {imageSrc && (
        <img
          src={imageSrc}
          className='hidden'
          onLoad={handleLoad}
          onError={handleError}
          alt=''
        />
      )}
    </>
  );
};
