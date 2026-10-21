import {
  AbsoluteFill,
  Composition,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type JoyClip = {
  src: string;
  /** Where to start inside the source video, in seconds. */
  from: number;
  seconds: number;
  caption: string;
  /** Source is landscape: shown fitted over a blurred copy of itself. */
  landscape?: boolean;
};

type Props = { clips: JoyClip[]; title: string };

const FPS = 30;
const FADE = 6;

const defaultClips: JoyClip[] = [
  { src: "trip4.mp4", from: 0, seconds: 3, caption: "Shanghai, China" },
  {
    src: "trip1.mp4",
    from: 12,
    seconds: 4,
    caption: "Farha w sa3ada",
    landscape: true,
  },
  { src: "trip3.mp4", from: 6, seconds: 3, caption: "Smile = Happiness" },
  {
    src: "trip2.mp4",
    from: 4,
    seconds: 3,
    caption: "Dikrayat jmila",
    landscape: true,
  },
  {
    src: "trip1.mp4",
    from: 30,
    seconds: 3,
    caption: "Merci China",
    landscape: true,
  },
];

const Slide: React.FC<{ clip: JoyClip; frames: number }> = ({
  clip,
  frames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, FADE, frames - FADE, frames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const pop = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const common = { startFrom: Math.round(clip.from * FPS) };

  return (
    <AbsoluteFill style={{ backgroundColor: "black", opacity }}>
      {clip.landscape ? (
        <>
          <OffthreadVideo
            src={staticFile(clip.src)}
            muted
            {...common}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(40px) brightness(0.7)",
              transform: "scale(1.2)",
            }}
          />
          <AbsoluteFill style={{ justifyContent: "center" }}>
            <OffthreadVideo
              src={staticFile(clip.src)}
              {...common}
              style={{ width: "100%", objectFit: "contain" }}
            />
          </AbsoluteFill>
        </>
      ) : (
        <OffthreadVideo
          src={staticFile(clip.src)}
          {...common}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      <div
        style={{
          position: "absolute",
          bottom: 260,
          width: "100%",
          textAlign: "center",
          color: "white",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 800,
          fontSize: 76,
          textShadow: "0 3px 12px rgba(0,0,0,0.7)",
          transform: `scale(${pop})`,
        }}
      >
        {clip.caption}
      </div>
    </AbsoluteFill>
  );
};

export const JoyVideo: React.FC<Props> = ({ clips }) => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {clips.map((clip, i) => {
        const frames = Math.round(clip.seconds * FPS);
        const start = from;
        from += frames;
        return (
          <Sequence key={i} from={start} durationInFrames={frames}>
            <Slide clip={clip} frames={frames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const JoyComposition = () => (
  <Composition
    id="Joy"
    component={JoyVideo}
    durationInFrames={480}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ clips: defaultClips, title: "" }}
    calculateMetadata={({ props }) => ({
      durationInFrames: props.clips.reduce(
        (s, c) => s + Math.round(c.seconds * FPS),
        0,
      ),
    })}
  />
);
