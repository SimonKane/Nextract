"use client";

import { Player } from "@remotion/player";
import { DataFilm } from "./DataFilm";

export default function DataFilmPlayer({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <Player
      component={DataFilm}
      durationInFrames={210}
      compositionWidth={1200}
      compositionHeight={900}
      fps={30}
      autoPlay={!reduceMotion}
      loop={!reduceMotion}
      controls={false}
      clickToPlay={false}
      initialFrame={reduceMotion ? 155 : 0}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
