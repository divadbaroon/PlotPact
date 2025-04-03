import React from 'react';

interface MultipleChoiceBoxProps {
  description: string;
  choices: string[];
  onSubmit: () => void;
  selectedChoice: string | null;
  setSelectedChoice: (selectedChoice: string) => void;
  isIncorrect: boolean;
  storyMode: boolean;
}

const MultipleChoiceBox: React.FC<MultipleChoiceBoxProps> = ({
  description,
  choices,
  onSubmit,
  setSelectedChoice,
  selectedChoice,
  isIncorrect,
  storyMode,
}) => {
  return (
    <div className='p-4 bg-gray-50 mt-4 animate-fade-in-left'>
      {!storyMode ? (
        <>
          {isIncorrect && (
            <div className='flex items-center text-red-600 text-sm gap-2 font-medium'>
              <span>❌</span>
              <span>Incorrect answer. Try again!</span>
            </div>
          )}
          <p className='text-lg font-medium mb-4 text-black'>{description}</p>
        </>
      ) : null}

      <div className='space-y-2'>
        {choices.map((choice, index) => (
          <label key={index} className='block text-black'>
            <input
              type='radio'
              name='choice'
              value={choice}
              checked={selectedChoice === choice}
              onChange={() => setSelectedChoice(choice)}
              className='mr-2'
            />
            {choice}
          </label>
        ))}
      </div>
      <button
        onClick={onSubmit}
        disabled={!selectedChoice}
        className={`mt-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer ${
          !selectedChoice ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Submit Choice
      </button>
    </div>
  );
};

export default MultipleChoiceBox;
