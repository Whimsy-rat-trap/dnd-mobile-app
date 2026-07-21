export const TOOL_ATTRIBUTE_MAP: Record<string, string> = {
    'Thieves\' Tools': 'DEX',
    'Herbalism Kit': 'INT',
    'Poisoner\'s Kit': 'INT',
    'Disguise Kit': 'CHA',
    'Forgery Kit': 'DEX',
    'Musical Instruments': 'CHA',
    'Artisan\'s Tools': 'DEX',
    'Alchemist\'s Supplies': 'INT',
    'Brewer\'s Supplies': 'INT',
    'Calligrapher\'s Supplies': 'DEX',
    'Carpenter\'s Tools': 'STR',
    'Cartographer\'s Tools': 'INT',
    'Cobbler\'s Tools': 'DEX',
    'Cook\'s Utensils': 'WIS',
    'Glassblower\'s Tools': 'DEX',
    'Jeweler\'s Tools': 'DEX',
    'Leatherworker\'s Tools': 'DEX',
    'Mason\'s Tools': 'STR',
    'Painter\'s Supplies': 'DEX',
    'Potter\'s Tools': 'DEX',
    'Smith\'s Tools': 'STR',
    'Tinker\'s Tools': 'DEX',
    'Weaver\'s Tools': 'DEX',
    'Woodcarver\'s Tools': 'DEX',
    'Gaming Set': 'CHA',
    'Navigator\'s Tools': 'WIS',
    'Vehicles (Land)': 'DEX',
    'Vehicles (Water)': 'STR',
};

export const getDefaultAttribute = (toolName: string): string => {
    return TOOL_ATTRIBUTE_MAP[toolName] || 'DEX';
};