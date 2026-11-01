import type { BrewStep, BrewStepId } from '~/types/brew'

export const brewMeta = {
  title: 'Temae, make a bowl of matcha',
  description: 'An interactive tea room. Scoop, pour, whisk, serve and drink a bowl of matcha in seven small steps.',
  sceneLabel: 'A tea room on a tatami mat with a bowl, a tea caddy, a bamboo scoop, a whisk and an iron kettle',
  homeLabel: 'Back to the Midoricha story',
  homeAction: 'Home'
}

export const brewIntro = {
  kanji: '点前',
  reading: 'temae',
  title: 'Make a bowl yourself',
  text: 'Temae is the way a host prepares tea in front of a guest. Here you are both. Seven small steps, about two minutes, and nothing happens until you do it.',
  action: 'Enter the tea room',
  back: 'Back to the story'
}

export const brewSteps: BrewStep[] = [
  {
    id: 'scoop',
    kanji: '掬',
    reading: 'sukuu',
    title: 'Scoop the matcha',
    hint: 'Tap the button to take matcha from the natsume with the bamboo scoop. Two scoops, about two grams, make one bowl.',
    gesture: 'tap'
  },
  {
    id: 'temperature',
    kanji: '湯',
    reading: 'yu',
    title: 'Let the water rest',
    hint: 'Water straight off the boil scalds matcha and turns it bitter. Slide the dial until the kettle sits around 80 °C.',
    gesture: 'slide'
  },
  {
    id: 'pour',
    kanji: '注',
    reading: 'sosogu',
    title: 'Pour',
    hint: 'Press and hold to pour with the bamboo ladle. Let go when the water reaches the mark, around 70 ml.',
    gesture: 'hold'
  },
  {
    id: 'whisk',
    kanji: '点',
    reading: 'tateru',
    title: 'Whisk',
    hint: 'Move quickly back and forth over the bowl in a loose M shape. Use the wrist, not the arm, until fine foam covers the surface.',
    gesture: 'whisk'
  },
  {
    id: 'serve',
    kanji: '出',
    reading: 'dasu',
    title: 'Serve the bowl',
    hint: "The host sets the bowl down in front of the guest with its most beautiful side, the front, facing them. Present the bowl, then take the guest's seat.",
    gesture: 'tap'
  },
  {
    id: 'turn',
    kanji: '回',
    reading: 'mawasu',
    title: 'Turn the bowl',
    hint: 'Now you are the guest. Out of respect you do not drink from the front, so drag to turn the bowl clockwise, a little at a time.',
    gesture: 'drag'
  },
  {
    id: 'drink',
    kanji: '飲',
    reading: 'nomu',
    title: 'Drink',
    hint: 'Press and hold to lift the bowl and drink. A bowl is finished in about three sips, and the last one is taken with a soft slurp.',
    gesture: 'hold'
  }
]

export const brewControls = {
  kettle: 'Kettle',
  temperatureLabel: 'Water temperature in degrees Celsius',
  water: 'Water in the bowl',
  foam: 'Foam',
  turned: 'Turned',
  drunk: 'Finished',
  scoop: 'Add a scoop',
  serve: 'Present the bowl',
  pour: 'Hold to pour',
  pourAgain: 'Empty the bowl and pour again',
  whiskKeys: 'or use the left and right arrow keys',
  turnKeys: 'or use the arrow keys',
  drink: 'Hold to drink',
  next: 'Next step',
  finish: 'Finish',
  restart: 'Start over',
  stepOf: 'Step'
}

export const brewFeedback: Record<BrewStepId, Record<string, string>> = {
  scoop: {
    empty: 'The bowl is waiting.',
    one: 'One scoop in. One more.',
    ready: 'Two scoops. That is one bowl.'
  },
  temperature: {
    hot: 'Still too hot. Let it cool a little more.',
    cool: 'Now it is too cool. The foam will not rise well.',
    ready: 'Around 80 °C. Just right.'
  },
  pour: {
    empty: 'Hold the button to start pouring.',
    low: 'A little more water.',
    ready: 'That is enough. Let go.',
    over: 'Too much water. The tea will taste thin.'
  },
  whisk: {
    start: 'Start whisking over the bowl.',
    keep: 'Keep going. Faster, from the wrist.',
    ready: 'A fine, even foam. Beautiful.'
  },
  serve: {
    start: 'The tea is ready to be served.',
    ready: 'The bowl is in front of you. You are the guest now.'
  },
  turn: {
    start: 'Drag to turn the bowl clockwise.',
    keep: 'A little further.',
    ready: 'The front now faces away. You may drink.'
  },
  drink: {
    start: 'Hold to lift the bowl to your lips.',
    sip: 'Sip slowly.',
    keep: 'Lift the bowl again for another sip.',
    ready: 'The bowl is empty.'
  }
}

export const brewComplete = {
  kanji: 'ご馳走様でした',
  reading: 'gochisōsama deshita',
  meaning: 'Thank you for the tea',
  text: 'Said quietly to the host once the bowl is empty. Today the host was you.',
  summary: {
    temperature: 'Water',
    water: 'Poured',
    whisk: 'Whisked'
  },
  again: 'Make another bowl',
  back: 'Back to the story'
}
