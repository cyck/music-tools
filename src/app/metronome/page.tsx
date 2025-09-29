"use client";

import {
  type ChangeEventHandler,
  useState,
  useEffect,
  type MouseEventHandler,
} from "react";
import * as Tone from "tone";

const MAX_TEMPO = 320;
const MIN_TEMPO = 0;

export default function Home() {
  const [tempo, setTempo] = useState(60);

  useEffect(() => {
    Tone.getTransport().bpm.rampTo(tempo, 0.1);
  }, [tempo]);

  const handleSetTempo: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    const tempo = parseInt(value, 10);

    if (tempo < MIN_TEMPO) {
      setTempo(MIN_TEMPO);
      return;
    }

    if (tempo > MAX_TEMPO) {
      setTempo(MAX_TEMPO);
      return;
    }

    setTempo(tempo);
  };

  const handleStartMetronome: MouseEventHandler<HTMLButtonElement> = () => {
    const tone = new Tone.Player("pop.wav").toDestination();
    new Tone.Loop(async (time) => {
      await Tone.loaded();
      tone.start(time);
    }).start(0);
    Tone.getTransport().start();
    Tone.getTransport().bpm.rampTo(tempo, 0.1);
  };

  const handleStopMetronome: MouseEventHandler<HTMLButtonElement> = () => {
    Tone.getTransport().stop();
  };

  return (
    <div>
      <button type="button" onClick={handleStartMetronome}>
        Start
      </button>

      <button type="button" onClick={handleStopMetronome}>
        Stop
      </button>
      <label htmlFor="tempo">Tempo</label>
      <input id="tempo" value={tempo} onChange={handleSetTempo} />
    </div>
  );
}
