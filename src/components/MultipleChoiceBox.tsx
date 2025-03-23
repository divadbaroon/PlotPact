import React, { useState } from "react";

interface MultipleChoiceBoxProps {
  description: string;
  choices: string[];
  onSubmit: (selectedChoice: string) => void;
}

const MultipleChoiceBox: React.FC<MultipleChoiceBoxProps> = ({ description, choices, onSubmit }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selectedChoice) {
      onSubmit(selectedChoice);
      setSelectedChoice(null); // Clear selection after submission
    }
  };

  return (
    <div className="border border-gray-300 p-4 rounded-lg shadow-md bg-white mt-4">
      <p className="text-lg font-medium mb-4 text-black">{description}</p>
      <div className="space-y-2">
        {choices.map((choice, index) => (
          <label key={index} className="block text-black">
            <input
              type="radio"
              name="choice"
              value={choice}
              checked={selectedChoice === choice}
              onChange={() => setSelectedChoice(choice)}
              className="mr-2"
            />
            {choice}
          </label>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!selectedChoice}
        className={`mt-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 ${
          !selectedChoice ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Submit Choice
      </button>
    </div>
  );
};

export default MultipleChoiceBox;
