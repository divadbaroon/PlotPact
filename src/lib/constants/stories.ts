export const INITIAL_STORIES = {
    LILA_STORY: {
      initialParagraph: `Lila found the box on her doorstep, small and wooden, with a single brass dial on the top. The note taped to it was short: "Turn the dial to the right number to save him." She froze, her heart racing. Who was "him"? Her little brother? Her dad? She didn't know, but she couldn't take any chances. She turned the box over, searching for clues, and spotted faint numbers etched along the edges. "It's a code," she whispered to herself, her hands trembling as she tried to figure out where to start.`,
      
      initialChoices: [
        "Carefully examine the numbers etched along the edges of the box.",
        "Check the note again for any hidden clues or markings.",
        "Try to remember if anyone mentioned something about a box recently.",
        "Look around the doorstep for additional clues."
      ],
  
      initialConstraints: [
        {
          id: "character-lila",
          function: "focusing",
          type: "channel",
          flexibility: "fixed",
          description: "Lila is established as intuitive and analytical",
          reason: "She immediately recognizes the numbers as a code and starts looking for clues",
          examples: {
            valid: ["Lila methodically examined each number", "She tried to find patterns in the markings"],
            invalid: ["She carelessly spun the dial randomly"]
          }
        },
        {
          id: "plot-urgency",
          function: "focusing",
          type: "channel",
          flexibility: "fixed",
          description: "The situation has established urgency",
          reason: "Someone needs to be saved, creating time pressure",
          examples: {
            valid: ["Her hands shook as she worked against time", "Every minute felt crucial"],
            invalid: ["She decided to deal with it tomorrow"]
          }
        },
        {
          id: "setting-mystery",
          function: "focusing",
          type: "anchor",
          flexibility: "faux-fixed",
          description: "The box is mysterious and requires solving",
          reason: "Contains specific elements: wooden box, brass dial, etched numbers",
          examples: {
            valid: ["The brass dial gleamed as she turned it", "She traced the etched numbers with her finger"],
            invalid: ["She opened the simple latch on the box"]
          }
        },
        {
          id: "stakes-personal",
          function: "focusing",
          type: "channel",
          flexibility: "flexible",
          description: "The stakes are personal and emotional",
          reason: "Possible threat to family member (brother or father)",
          examples: {
            valid: ["She thought of her brother's smile", "Fear for her father gripped her heart"],
            invalid: ["She considered calling the police"]
          }
        }
      ]
    }
  };