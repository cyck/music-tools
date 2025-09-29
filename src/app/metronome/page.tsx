"use client";

import classNames from "classnames";
import {
  useEffect,
  useState,
  type ChangeEventHandler,
  type MouseEventHandler,
} from "react";
import { IoPause, IoPlay } from "react-icons/io5";
import * as Tone from "tone";

const MAX_TEMPO = 320;
const MIN_TEMPO = 30;

export default function Home() {
  const [tempo, setTempo] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleToggleMetronome: MouseEventHandler<HTMLButtonElement> = () => {
    if (isPlaying) {
      Tone.getTransport().stop();
      setIsPlaying(false);
      return;
    }

    const tone = new Tone.Player("pop.wav").toDestination();
    new Tone.Loop(async (time) => {
      await Tone.loaded();
      tone.start(time);
    }).start(0);
    Tone.getTransport().start();
    Tone.getTransport().bpm.rampTo(tempo, 0.1);
    setIsPlaying(true);
  };

  return (
    <div className="bg-white flex flex-col items-center p-8 rounded-2xl shadow-sm w-80 gap-8">
      <h1 className="text-2xl font-medium text-gray-800">Metronome</h1>
      <div className="w-full">
        <label
          htmlFor="tempo"
          className="block text-sm font-medium text-gray-500 mb-2"
        >
          Tempo
        </label>
        <div className="flex items-center w-full">
          <input
            id="tempo"
            type="number"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={tempo}
            onChange={handleSetTempo}
            min={MIN_TEMPO}
            max={MAX_TEMPO}
          />
          <span className="ml-2 text-sm text-gray-500">BPM</span>
        </div>
      </div>
      <button
        type="button"
        className={classNames(
          "w-16 h-16 rounded-full flex items-center justify-center",
          {
            "bg-red-500 hover:bg-red-600": isPlaying,
            "bg-blue-500 hover:bg-blue-600": !isPlaying,
          },
        )}
        onClick={handleToggleMetronome}
      >
        {isPlaying ? (
          <IoPause className="w-8 h-8" color="white" />
        ) : (
          <IoPlay className="w-8 h-8" color="white" viewBox="-25 0 512 512" />
        )}
      </button>
    </div>
  );
}
