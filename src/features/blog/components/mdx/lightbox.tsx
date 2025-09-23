import YARLightbox, {
  type LightboxExternalProps,
  type SlideImage,
} from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

const LightboxSlide = ({ slide }: { slide: SlideImage }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={slide.src}
    alt={slide.alt}
    className="max-h-full rounded-lg"
    draggable={false}
  />
);

type ImageLightboxProps = {
  open: boolean;
  controls?: () => React.ReactNode;
  onClose: () => void;
  index?: number;
  slides: SlideImage[];
} & Omit<LightboxExternalProps, "open" | "close" | "index" | "slides">;

export const Lightbox = ({
  open,
  controls,
  onClose,
  index,
  slides,
  render: customRender,
  ...rest
}: ImageLightboxProps) => (
  <YARLightbox
    {...rest}
    open={open}
    close={onClose}
    render={{
      ...customRender, // For overrides (eg. disabling next/prev buttons)
      controls,
      slide: LightboxSlide,
    }}
    index={index}
    slides={slides}
    controller={{ closeOnBackdropClick: true }}
    plugins={[Download, Zoom]}
    zoom={{
      scrollToZoom: true,
      maxZoomPixelRatio: 2,
      doubleClickMaxStops: 1,
    }}
    animation={{ zoom: 200, fade: 200 }}
    styles={{
      container: {
        backgroundColor: "hsla(0, 0%, 0%, 0.75)",
        backdropFilter: "blur(8px)",
      },
    }}
  />
);
