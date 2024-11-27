import React from "react";

type Props = {
  setReaction: (reaction: string) => void;
};

export default function ReactionSelector({ setReaction }: Props) {
  return (
    <div
    className='absolute bottom-20 left-0 right-0 mx-auto w-fit transform rounded-full bg-white px-2 flex'
    onPointerMove={(e) => e.stopPropagation()}
    >
      <ReactionButton reaction="👍" onSelect={setReaction} />
      <ReactionButton reaction="🔥" onSelect={setReaction} />
      <ReactionButton reaction="😍" onSelect={setReaction} />
      <ReactionButton reaction="👀" onSelect={setReaction} />
      <ReactionButton reaction="😱" onSelect={setReaction} />
      <ReactionButton reaction="🙁" onSelect={setReaction} />
      <ReactionButton reaction="💀" onSelect={setReaction} />
      <div className="mt-2 text-left max-w-[400px] text-xs">
        <p className="text-red-700 text-lefte mb-2 underline">*Emojis will keep coming out even after hitting escape , so make sure to wait a little before using another emoji.This feature will be fixed soon.</p>
      </div>
      
    </div>
  );
}

function ReactionButton({
  reaction,
  onSelect,
}: {
  reaction: string;
  onSelect: (reaction: string) => void;
}) {
  return (
    <button
      className="transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none"
      onPointerDown={() => onSelect(reaction)}
    >
      {reaction}
    </button>
  );
}
