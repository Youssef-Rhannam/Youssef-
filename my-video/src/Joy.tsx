import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";

export type JoyClip = {
  src: string;
  /** Where to start inside the source video, in seconds. */
  from: number;
  seconds: number;
  /** Source is landscape: shown fitted over a blurred copy of itself. */
  landscape?: boolean;
};

type Props = { clips: JoyClip[]; title: string };

const FPS = 30;

const defaultClips: JoyClip[] = [
  { src: "trip4.mp4", from: 0, seconds: 3 },
  {
    src: "trip1.mp4",
    from: 12,
    seconds: 4,
    landscape: true,
  },
  { src: "trip3.mp4", from: 6, seconds: 3 },
  {
    src: "trip2.mp4",
    from: 4,
    seconds: 3,
    landscape: true,
  },
  {
    src: "trip1.mp4",
    from: 30,
    seconds: 3,
    landscape: true,
  },
];

const Slide: React.FC<{ clip: JoyClip; frames: number }> = ({
  clip,
  frames,
}) => {
  const common = { startFrom: Math.round(clip.from * FPS) };

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
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
