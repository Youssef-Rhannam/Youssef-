import {
  AbsoluteFill,
  Composition,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";

export type Clip = {
  /** File inside public/, e.g. "office.mp4" or "site.jpg". Empty = placeholder. */
  src: string;
  caption: string;
  seconds: number;
};

type Props = { clips: Clip[] };

const FPS = 30;

const defaultClips: Clip[] = [
  { src: "", caption: "Lkhdma f bureau", seconds: 4 },
  { src: "", caption: "Khdma f chantier", seconds: 6 },
];

const isVideo = (src: string) => /\.(mp4|mov|webm|m4v)$/i.test(src);

const Slide: React.FC<{ clip: Clip }> = ({ clip }) => (
  <AbsoluteFill style={{ backgroundColor: "#222" }}>
    {clip.src === "" ? null : isVideo(clip.src) ? (
      <OffthreadVideo
        src={staticFile(clip.src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      <Img
        src={staticFile(clip.src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    )}
    <div
      style={{
        position: "absolute",
        top: "28%",
        width: "100%",
        textAlign: "center",
        color: "white",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 700,
        fontSize: 64,
        textShadow: "0 2px 8px rgba(0,0,0,0.6)",
      }}
    >
      {clip.caption}
    </div>
  </AbsoluteFill>
);

export const MyComponent: React.FC<Props> = ({ clips }) => {
  let from = 0;
  return (
    <AbsoluteFill>
      {clips.map((clip, i) => {
        const durationInFrames = Math.round(clip.seconds * FPS);
        const start = from;
        from += durationInFrames;
        return (
          <Sequence key={i} from={start} durationInFrames={durationInFrames}>
            <Slide clip={clip} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={300}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ clips: defaultClips }}
      calculateMetadata={({ props }) => ({
        durationInFrames: Math.max(
          1,
          props.clips.reduce((s, c) => s + Math.round(c.seconds * FPS), 0),
        ),
      })}
    />
  );
};
