import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    priority = false,
    className,
    ...props
}: OptimizedImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={className}
            {...props}
        />
    );
}
