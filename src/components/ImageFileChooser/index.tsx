import { FC, useCallback, useRef, useState } from "react";

import { Button } from "../Button";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

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
      <Button
        className={className}
        iconType='image'
        title={title}
        onClick={handleClick}
      />
      <input
        ref={inputRef}
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
