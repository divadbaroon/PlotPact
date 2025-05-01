const story1 = {
  title: 'The Box with the Brass Dial',

  plot: `Lila found the box on her doorstep, small and wooden, with a single brass dial on the top. The note taped to it was short: "Turn the dial to the right number to save him." She froze, her heart racing. Who was "him"? Her little brother? Her dad? She didn't know, but she couldn't take any chances. She turned the box over, searching for clues, and spotted faint numbers etched along the edges. 

  "It's a code," she whispered to herself, her hands trembling as she tried to figure out where to start.`,
};

const story2 = {
  title: `The Knight's Stand`,

  plot: `The fire crackles low in your cottage. Outside, the winds carry the scent of pine and wet earth. Oakendale — your quiet refuge from the world — sleeps in peace. You sit alone, nursing a half-filled mug, your hands calloused from farming, not war. Your armor lies buried beneath the floorboards, untouched in decades. Then, the world changes. A roar, ancient and unholy, splits the sky. The ground trembles. Dust drifts from the rafters. You rise to your feet — not quickly, not easily, but with purpose. Gorran, your old warhound, growls beside you. You already know what's coming.`,
};

export function startTemplateStory(storyId: string) {
  if (storyId == '1') return story1;
  else if (storyId == '2') return story2;
  else return story1;
}
