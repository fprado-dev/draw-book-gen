import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Define the states as an object
const optionsState = {
  starting: 'Initializing...',
  sending: 'Sending prompt...',
  loading: 'Loading model...',
  waiting: 'Waiting for response...',
  processing: 'Processing data...',
  verifying: 'Verifying results...',
  almost: 'Almost there...',
  done: 'Finished',
  // Add more states here as needed, e.g.:
};

// Define one-time states (appear only once)
const oneTimeStates = ['starting', 'sending', 'loading'];

function CreatingLoadingAnimation({ isCreating }: { isCreating: boolean }) {
  // Separate one-time and looping states
  const loopingStates = Object.keys(optionsState).filter(
    (key) => !oneTimeStates.includes(key) && key !== 'done'
  );
  const initialTexts = [...oneTimeStates, ...loopingStates];

  // State to manage the current sequence of texts
  const [texts, setTexts] = useState(initialTexts);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    // When isCreating is false, show "done" and stop
    if (!isCreating) {
      setTexts(['done']);
      setCurrentTextIndex(0);
      return;
    }

    // When isCreating is true, manage the sequence
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => {
        // If still in one-time states, move to the next
        if (prevIndex < oneTimeStates.length - 1) {
          return prevIndex + 1;
        }
        // Once one-time states are done, loop through looping states
        else {
          const loopingIndex =
            (prevIndex - oneTimeStates.length + 1) % loopingStates.length;
          return loopingIndex + oneTimeStates.length;
        }
      });
    }, 2500); // Switch text every 2 seconds

    // Cleanup interval on unmount or when isCreating changes
    return () => clearInterval(interval);
  }, [isCreating, loopingStates.length]);

  // Get the current text to display
  const currentTextKey = texts[currentTextIndex];
  const currentText =
    optionsState[currentTextKey as keyof typeof optionsState] || '';

  // Animation variants for letter bounce effect
  const letterVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: i * 0.05,
      },
    }),
  };

  return (
    <motion.span className="text-sm ">
      {currentText.split('').map((letter, index) => (
        <motion.span
          key={`${currentTextKey}-${index}`}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          custom={index}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default CreatingLoadingAnimation;
