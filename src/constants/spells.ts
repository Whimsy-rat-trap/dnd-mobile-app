import { Spell } from '../types/Character';

export const ALL_SPELLS: Omit<Spell, 'id' | 'prepared'>[] = [
    {
        name: 'Acid Splash',
        level: 0,
        school: 'Conjuration',
        castingTime: '1 action',
        range: '60 ft',
        components: 'V, S',
        description: 'You hurl a bubble of acid. Choose one creature within range, or two creatures within 5 feet of each other.'
    },
    {
        name: 'Blade Ward',
        level: 0,
        school: 'Abjuration',
        castingTime: '1 action',
        range: 'Self',
        components: 'V, S',
        description: 'You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.'
    },
    {
        name: 'Chill Touch',
        level: 0,
        school: 'Necromancy',
        castingTime: '1 action',
        range: '120 ft',
        components: 'V, S',
        description: 'You create a ghostly, skeletal hand that attacks a creature.'
    },
    {
        name: 'Dancing Lights',
        level: 0,
        school: 'Evocation',
        castingTime: '1 action',
        range: '120 ft',
        components: 'V, S, M',
        description: 'You create up to four torch-sized lights within range.'
    },
    {
        name: 'Fire Bolt',
        level: 0,
        school: 'Evocation',
        castingTime: '1 action',
        range: '120 ft',
        components: 'V, S',
        description: 'You hurl a mote of fire at a creature or object within range.'
    },
    {
        name: 'Poison Spray',
        level: 0,
        school: 'Conjuration',
        castingTime: '1 action',
        range: '10 ft',
        components: 'V, S',
        description: 'You project a puff of noxious gas.'
    },
    {
        name: 'Chromatic Orb',
        level: 1,
        school: 'Evocation',
        castingTime: '1 action',
        range: '90 ft',
        components: 'V, S, M',
        description: 'You hurl a 4-inch-diameter sphere of energy.'
    },
    {
        name: 'Magic Missile',
        level: 1,
        school: 'Evocation',
        castingTime: '1 action',
        range: '120 ft',
        components: 'V, S',
        description: 'You create three glowing darts of magical force.'
    },
    {
        name: 'Shield',
        level: 1,
        school: 'Abjuration',
        castingTime: '1 reaction',
        range: 'Self',
        components: 'V, S',
        description: 'An invisible barrier of magical force appears and protects you.'
    },
    {
        name: 'Cure Wounds',
        level: 1,
        school: 'Evocation',
        castingTime: '1 action',
        range: 'Touch',
        components: 'V, S',
        description: 'A creature you touch regains a number of hit points.'
    },
    {
        name: 'Invisibility',
        level: 2,
        school: 'Illusion',
        castingTime: '1 action',
        range: 'Touch',
        components: 'V, S, M',
        description: 'A creature you touch becomes invisible until the spell ends.'
    },
    {
        name: 'Misty Step',
        level: 2,
        school: 'Conjuration',
        castingTime: '1 bonus action',
        range: 'Self',
        components: 'V',
        description: 'Briefly surrounded by silvery mist, you teleport up to 30 feet.'
    },
    {
        name: 'Scorching Ray',
        level: 2,
        school: 'Evocation',
        castingTime: '1 action',
        range: '120 ft',
        components: 'V, S',
        description: 'You create three rays of fire and hurl them at targets.'
    },
    {
        name: 'Counterspell',
        level: 3,
        school: 'Abjuration',
        castingTime: '1 reaction',
        range: '60 ft',
        components: 'S',
        description: 'You attempt to interrupt a creature in the process of casting a spell.'
    },
    {
        name: 'Fireball',
        level: 3,
        school: 'Evocation',
        castingTime: '1 action',
        range: '150 ft',
        components: 'V, S, M',
        description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame.'
    },
    {
        name: 'Haste',
        level: 3,
        school: 'Transmutation',
        castingTime: '1 action',
        range: '30 ft',
        components: 'V, S, M',
        description: 'Choose a willing creature that you can see within range. Until the spell ends, the target\'s speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns.'
    },
];