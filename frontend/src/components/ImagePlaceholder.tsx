interface ImagePlaceholderProps {
  slot: string;
  label: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
  className?: string;
}

const aspectClasses = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-video',
};

const ImagePlaceholder = ({
  slot,
  label,
  aspectRatio = 'landscape',
  className = '',
}: ImagePlaceholderProps) => {
  return (
    <div
      className={`
        ${aspectClasses[aspectRatio]}
        bg-gradient-to-br from-muted to-muted/50
        rounded-2xl
        flex flex-col items-center justify-center
        border-2 border-dashed border-border
        text-muted-foreground
        ${className}
      `}
      data-slot={slot}
    >
      <svg
        className="w-10 h-10 mb-3 opacity-40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 21h18"
        />
      </svg>
      <p className="text-sm font-medium opacity-60">{label}</p>
      <p className="text-xs opacity-40 mt-1">slot: {slot}</p>
    </div>
  );
};

export default ImagePlaceholder;
